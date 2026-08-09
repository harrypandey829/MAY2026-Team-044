from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field

from app.common.enums import RegistrationStatus


class RegisterEventRequest(BaseModel):

    event_id: UUID

    member_id: UUID


class RegistrationResponse(BaseModel):

    id: UUID

    event_id: UUID

    member_id: UUID = Field(validation_alias="user_id")

    registration_status: RegistrationStatus = Field(validation_alias="status")

    registered_at: datetime = Field(validation_alias="created_at")

    class Config:
        from_attributes = True
        populate_by_name = True