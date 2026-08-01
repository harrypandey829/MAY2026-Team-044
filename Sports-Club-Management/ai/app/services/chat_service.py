from google.genai import types

from app.clients.gemini_client import client
from app.prompts.system_prompt import SYSTEM_PROMPT


class ChatService:

    def chat(
        self,
        message: str
    ) -> str:

        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=message,

            config=types.GenerateContentConfig(

                system_instruction=SYSTEM_PROMPT
            )
        )

        return response.text