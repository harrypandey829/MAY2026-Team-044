from fastapi import APIRouter

from app.schemas.ai_schema import ChatRequest
from app.schemas.ai_schema import ChatResponse
from app.services.ai_service import AIService


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

service = AIService()


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest
):

    answer = service.chat(
        request.message
    )

    return ChatResponse(
        answer=answer
    )