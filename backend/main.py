import asyncio
import websockets
import json
from typing import Dict, Optional

from ml.pipeline import SessionPipeline  # Your ML pipeline here

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
                print('Received message from user')
                user_message = data['message']
                character_ids = data['character_ids']
                self.pipeline.load_user_response(user_message, character_ids)

                while not self.pipeline.response_queue.empty():
                    print('Sending character response to user')
                    response = self.pipeline.response_queue.get()
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

class WebSocketServer:
    def __init__(self, host: str = "localhost", port: int = 8765):
        self.host = host
        self.port = port
        self.pipeline: Optional[SessionPipeline] = None
        self.sessions: Dict[str, WebSocketSession] = {}

    async def handler(self, websocket):
        session_id = str(id(websocket))
        print(f"Client connected: {session_id}")

        # Shared pipeline initialized only once
        if self.pipeline is None:
            print("Initializing shared pipeline...")
            self.pipeline = SessionPipeline()
            self.pipeline.initialize()

        session = WebSocketSession(websocket, self.pipeline, initialized=True)
        self.sessions[session_id] = session

        send_task = asyncio.create_task(session.send_loop())
        recv_task = asyncio.create_task(session.receive_loop())

        done, pending = await asyncio.wait(
            [send_task, recv_task],
            return_when=asyncio.FIRST_COMPLETED
        )

        for task in pending:
            task.cancel()

        del self.sessions[session_id]
        print(f"Client disconnected: {session_id}")

    async def start(self):
        print(f"Starting WebSocket server at ws://{self.host}:{self.port}")
        async with websockets.serve(self.handler, self.host, self.port):
            await asyncio.Future()  # Run forever

if __name__ == "__main__":
    server = WebSocketServer()
    asyncio.run(server.start())
