import httpx
from fastapi import HTTPException

from app.core.config import AI_SERVICE_URL


class AIClient:

    def chat(
        self,
        message: str
    ) -> dict:

        try:

            response = httpx.post(

                f"{AI_SERVICE_URL}/ai/chat",

                json={

                    "message": message

                },

                timeout=60
            )

            response.raise_for_status()

            return response.json()

        except httpx.ConnectError:

            raise HTTPException(

                status_code=503,

                detail="AI service is unavailable."

            )

        except httpx.TimeoutException:

            raise HTTPException(

                status_code=504,

                detail="AI service timeout."

            )

        except httpx.HTTPStatusError as e:

            raise HTTPException(

                status_code=e.response.status_code,

                detail=e.response.text

            )