from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreateAnnouncementRequest(BaseModel):

    title: str

    message: str

    created_by: UUID | str | None = None


class UpdateAnnouncementRequest(BaseModel):

    title: str

    message: str


class AnnouncementResponse(BaseModel):

    id: UUID

    title: str

    message: str

    created_by: UUID

    created_at: datetime

    class Config:

        from_attributes = True