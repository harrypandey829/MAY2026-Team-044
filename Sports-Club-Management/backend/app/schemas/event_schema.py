from datetime import date as DateType
from datetime import time as TimeType
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from app.common.enums import EventType


class CreateEventRequest(BaseModel):

    team_id: UUID | None = None

    title: str

    event_type: EventType

    date: DateType

    start_time: TimeType

    end_time: TimeType | None = None

    venue: str

    opponent: str | None = None

    description: str | None = None

    sport: str | None = None

    max_participants: int | None = None

    registration_deadline: DateType | None = None

    created_by: UUID | str | None = None


class UpdateEventRequest(BaseModel):

    title: str | None = None

    event_type: EventType | None = None

    date: DateType | None = None

    start_time: TimeType | None = None

    end_time: TimeType | None = None

    venue: str | None = None

    opponent: str | None = None

    description: str | None = None

    sport: str | None = None

    event_status: str | None = None

    max_participants: int | None = None

    registration_deadline: DateType | None = None


class EventResponse(BaseModel):

    id: UUID

    team_id: UUID | None

    created_by: UUID

    title: str

    description: str | None

    sport: str | None = None

    event_type: EventType

    event_status: str

    date: DateType

    start_time: TimeType

    end_time: TimeType | None

    venue: str

    opponent: str | None

    max_participants: int | None

    registration_deadline: DateType | None

    is_registration_open: bool

    created_at: datetime

    class Config:
        from_attributes = True