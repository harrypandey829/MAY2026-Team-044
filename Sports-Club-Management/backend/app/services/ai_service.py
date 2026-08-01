from app.clients.ai_client import AIClient


class AIService:

    def __init__(self):

        self.ai_client = AIClient()

    def chat(
        self,
        message: str
    ) -> str:

        response = self.ai_client.chat(message)

        return response["answer"]