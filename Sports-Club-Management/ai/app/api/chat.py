from fastapi import APIRouter

from app.schemas.chat_schema import (
    ChatRequest,
    ChatResponse
)

from app.services.chat_service import ChatService


router = APIRouter(

    prefix="/ai",

    tags=["AI"]
)

service = ChatService()


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