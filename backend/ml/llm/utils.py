import json
import os

def get_secrets_json():
    file_dir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(file_dir, '..', 'secrets.json')
    try:
        with open(filename, mode='r') as f:
            return json.loads(f.read())
    except FileNotFoundError:
        print('secrets.json not found')
        return {}

def retrieve_key(api : str) -> str:
    try:
        return get_secrets_json()[api]
    except:
        return ''