from ml.pipeline import SessionPipeline
from pprint import pprint

def display_topic(pipeline: SessionPipeline):
    print("\n=== TOPIC ===")
    print(f"Debate Topic: {pipeline.topic.topic}")
    print(f"Affirmative: {pipeline.topic.contention_yes}")
    print(f"Negative:    {pipeline.topic.contention_no}")

def display_characters(pipeline: SessionPipeline):
    print("\n=== CHARACTERS ===")
    for idx, char in enumerate(pipeline.characters):
        print(f"\n[{idx}] {char.name}, age {char.age}")
        print(f"→ Position: {char.position}")
        print(f"→ Experience: {char.experience}")

def display_character_updates(queue):
    print("\n=== RESPONSES ===")
    while not queue.empty():
        item = queue.get()
        print(f"\nCharacter [{item['character_id']}]:")
        print(f"Response: {item['response']}")
        print(f"Updated Position: {item['position_update']:.2f}")

def main():
    pipeline = SessionPipeline()
    pipeline.initialize()

    display_topic(pipeline)
    display_characters(pipeline)

    while True:
        try:
            user_input = input("\nEnter your response (or type 'exit'): ").strip()
            if user_input.lower() == 'exit':
                break

            ids_input = input("Which character(s) to respond to? (comma-separated indices): ").strip()
            character_ids = [int(idx) for idx in ids_input.split(",") if idx.strip().isdigit()]

            pipeline.load_user_response(user_input, character_ids)
            display_character_updates(pipeline.response_queue)

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
