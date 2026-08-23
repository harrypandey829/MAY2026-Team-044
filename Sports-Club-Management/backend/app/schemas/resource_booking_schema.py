from uuid import UUID
from datetime import date, time, datetime
from pydantic import BaseModel, field_validator

def safe_uuid(v):
    if v is None:
        return None
    if isinstance(v, UUID):
        return v
    try:
        return UUID(str(v))
    except Exception:
        return None

class CreateResourceBookingRequest(BaseModel):
    resource_id: UUID | None = None
    member_id: UUID | None = None
    coach_id: UUID | None = None
    sport_name: str | None = None
    venue_name: str | None = None
    booking_date: date
    start_time: str | None = None
    end_time: str | None = None
    duration_hours: int = 1
    remarks: str | None = None

    @field_validator("coach_id", "member_id", "resource_id", mode="before")
    def parse_uuids(cls, v):
        return safe_uuid(v)

    @field_validator("booking_date", mode="before")
    def parse_booking_date(cls, v):
        if isinstance(v, str) and "T" in v:
            return v.split("T")[0]
        return v

class UpdateResourceBookingRequest(BaseModel):
    booking_date: date
    duration_hours: int = 1
    is_cancelled: bool = False

    @field_validator("booking_date", mode="before")
    def parse_booking_date(cls, v):
        if isinstance(v, str) and "T" in v:
            return v.split("T")[0]
        return v

class UpdateResourceBookingStatusRequest(BaseModel):
    status: str  # APPROVED, REJECTED, CANCELLED
    remarks: str | None = None

class ResourceBookingResponse(BaseModel):
    id: UUID
    resource_id: UUID | None = None
    member_id: UUID | None = None
    coach_id: UUID | None = None
    sport_name: str | None = None
    venue_name: str | None = None
    booking_date: date
    start_time: str | None = None
    end_time: str | None = None
    duration_hours: int | None = 1
    status: str = "APPROVED"
    remarks: str | None = None
    is_cancelled: bool = False
    created_at: datetime

    @field_validator("start_time", "end_time", mode="before")
    def format_time_str(cls, v):
        if v is None:
            return None
        if isinstance(v, time):
            return v.strftime("%H:%M")
        return str(v)

    class Config:
        from_attributes = True