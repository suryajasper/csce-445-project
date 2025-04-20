import os

class Prompt:
    def __init__(self, prompt_name: str, data:dict = None):
        self.prompt_dir = 'ml/prompts'
        self.prompt_template = self.load_prompt_content(prompt_name)
        if data:
            self.prompt_content = self.fill_data(data)
        else:
            self.prompt_content = self.prompt_template

    def load_prompt_content(self, prompt_name: str) -> str:
        self.prompt_file = os.path.join(self.prompt_dir, f'{prompt_name}.prompt')
        with open(self.prompt_file, 'r') as file:
            return file.read()
        return ''
    
    def fill_data(self, data: dict[str, str]) -> str:
        content = self.prompt_template
        for token, replacement in data.items():
            content = content.replace('{' + token + '}', replacement)
        self.prompt_content = content
        return content
    
    def get_content(self) -> str:
        return self.prompt_content