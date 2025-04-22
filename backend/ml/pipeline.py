from ml.types import Topic, Character, CharacterList, CharacterResponse, Conversation
from ml.llm import GPT
from ml.llm import Prompt
from queue import Queue

class SessionPipeline:
    def __init__(self):
        self.topic : Topic = None
        self.characters : list[Character] = []
        self.conversations : list[Conversation] = []
        self.llm = GPT()
        self.response_queue = Queue()
        self.initialized = False
    
    def initialize(self, topic: str = None):
        if not topic:
            self.generate_topic()
        else:
            self.load_topic(topic)
        self.generate_characters()
        self.initialized = True
    
    def generate_topic(self):
        topic_dict: dict = self.llm.request(
            role='You are tasked with generating topics for debate',
            prompt=Prompt('generate-topic').get_content(),
            output_schema=Topic
        )
        self.topic = Topic(**topic_dict)
    
    def load_topic(self, topic: str):
        prompt = Prompt('amend-topic', { 'TOPIC': topic })
        topic_dict: dict = self.llm.request(
            role='You are tasked with explicitly defining topics for debate',
            prompt=prompt.get_content(),
            output_schema=Topic
        )
        self.topic = Topic(**topic_dict)
    
    def generate_characters(self):
        prompt = Prompt('generate-characters', { 
            'TOPIC_INFO': self.topic.model_dump_json(indent=4),
        })
        characters_dict = self.llm.request(
            role='You are tasked with generating unique characters for a debate',
            prompt=prompt.get_content(),
            output_schema=CharacterList
        )
        self.characters = CharacterList(**characters_dict).characters
        for i, character in enumerate(self.characters):
            character.id = i
        self.conversations = [[] for _ in range(len(self.characters))]
    
    def load_user_response(self, user_response: str, character_ids: list[int]):
        for character_id in character_ids:
            self.conversations[character_id].append({
                'role': 'user', 'content': user_response,
            })
            character_response = self.get_character_response(character_id)
            self.conversations[character_id].append({
                'role': 'assistant', 
                'content': character_response.model_dump_json(indent=4)
            })
            self.characters[character_id].position = character_response.position_update
            self.response_queue.put({
                'character_id': character_id,
                'response': character_response.response,
                'position_update': character_response.position_update,
                'history': self.conversations[character_id],
            })
        
    def get_character_response(self, character_id: int) -> CharacterResponse:
        character = self.characters[character_id]
        prompt = Prompt('character-response', { 
            'CHARACTER_INFO': character.model_dump_json(indent=4),
            'TOPIC_INFO': self.topic.model_dump_json(indent=4),
        })
        character_response_dict: dict = self.llm.request(
            role='You are tasked with generating authentic responses in-character',
            prompt=prompt.get_content(),
            output_schema=CharacterResponse,
            history=self.conversations[character_id]
        )
        character_response = CharacterResponse(**character_response_dict)
        return character_response
    
