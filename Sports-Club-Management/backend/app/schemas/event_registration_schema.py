from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from app.common.enums import RegistrationStatus


class RegisterEventRequest(BaseModel):

    event_id: UUID

    member_id: UUID


class RegistrationResponse(BaseModel):

    id: UUID

    event_id: UUID

    member_id: UUID

    registration_status: RegistrationStatus

    registered_at: datetime

    class Config:
        from_attributes = True