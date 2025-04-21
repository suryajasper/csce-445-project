import asyncio
import websockets
import json
from typing import Dict, Optional

from ml.pipeline import SessionPipeline  # Your pipeline class

class WebSocketSession:
    def __init__(self, websocket, pipeline: SessionPipeline, initialized: bool):
        self.websocket = websocket
        self.send_queue = asyncio.Queue()
        self.pipeline = pipeline
        self.already_initialized = initialized  # Avoid double init

    async def send_loop(self):
        # Send initial topic/characters on new connection
        await self.websocket.send(json.dumps({
            'type': 'initialize',
            'data': {
                'topic': self.pipeline.topic.model_dump(),
                'characters': [c.model_dump() for c in self.pipeline.characters],
            }
        }))

        while True:
            message = await self.send_queue.get()
            try:
                await self.websocket.send(json.dumps(message))
            except websockets.ConnectionClosed:
                print("Connection closed during send.")
                break

    async def receive_loop(self):
        try:
            async for message in self.websocket:
                await self.on_message(message)
        except websockets.ConnectionClosed:
            print("Connection closed during receive.")

    async def on_message(self, raw_message: str):
        try:
            message = json.loads(raw_message)
            data = message['data']

            if message['type'] == 'user_response':
                print('Received message')
                user_message = data['message']
                character_ids = data['character_ids']
                self.pipeline.load_user_response(user_message, character_ids)

                while not self.pipeline.response_queue.empty():
                    response = self.pipeline.response_queue.get()
                    print('sending character response')
                    await self.send_queue.put({
                        'type': 'character_response',
                        'data': {
                            'character_id': response['character_id'],
                            'response': response['response'],
                            'position_update': response['position_update'],
                            'history': response['history'],
                        }
                    })
        except Exception as e:
            print("Error processing message:", e)
