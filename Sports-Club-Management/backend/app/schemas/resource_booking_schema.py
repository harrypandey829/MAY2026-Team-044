from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreateResourceBookingRequest(BaseModel):

    resource_id: UUID

    member_id: UUID

    booking_date: datetime

    duration_hours: int


class UpdateResourceBookingRequest(BaseModel):

    booking_date: datetime

    duration_hours: int

    is_cancelled: bool


class ResourceBookingResponse(BaseModel):

    id: UUID

    resource_id: UUID

    member_id: UUID

    booking_date: datetime

    duration_hours: int

    is_cancelled: bool

    created_at: datetime

    user_name: str | None = None

    user_role: str | None = None

    resource_name: str | None = None

    class Config:

        from_attributes = True