from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreateNotificationRequest(BaseModel):

    member_id: UUID

    title: str

    message: str


class NotificationResponse(BaseModel):

    id: UUID

    member_id: UUID

    title: str

    message: str

    is_read: bool

    created_at: datetime

    class Config:

        from_attributes = True