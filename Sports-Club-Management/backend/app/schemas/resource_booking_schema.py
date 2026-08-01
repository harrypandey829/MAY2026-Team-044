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

    class Config:

        from_attributes = True