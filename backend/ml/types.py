from pydantic import BaseModel
from typing import List, Dict, Any

class Topic(BaseModel):
    topic: str
    contention_yes: str
    contention_no: str

class Character(BaseModel):
    id: int
    name: str
    age: int
    position: float
    experience: str
    speech_style: str

class CharacterList(BaseModel):
    characters: List[Character]

class CharacterResponse(BaseModel):
    response: str
    position_update: float

Conversation = List[Dict[str, Any]]