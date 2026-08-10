from unittest.mock import patch
from fastapi import HTTPException
from tests.conftest import client


@patch("app.services.ai_service.AIClient.chat")
def test_ai_chat_success(mock_chat):
    mock_chat.return_value = {
        "answer": "Football practice is scheduled at 5:00 PM tomorrow on the Main Pitch."
    }

    response = client.post(
        "/ai/chat",
        json={
            "message": "What time is football practice tomorrow?"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "Football practice" in data["answer"]


@patch("app.services.ai_service.AIClient.chat")
def test_ai_chat_service_unavailable(mock_chat):
    mock_chat.side_effect = HTTPException(
        status_code=503,
        detail="AI service is unavailable."
    )

    response = client.post(
        "/ai/chat",
        json={
            "message": "What time is practice?"
        }
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "AI service is unavailable."


def test_ai_chat_invalid_payload():
    response = client.post(
        "/ai/chat",
        json={}
    )
    assert response.status_code == 422

