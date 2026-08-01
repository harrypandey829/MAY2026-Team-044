from datetime import date
from datetime import time
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from app.common.enums import EventType


class CreateEventRequest(BaseModel):

    team_id: UUID | None = None

    title: str

    event_type: EventType

    date: date

    start_time: time

    end_time: time | None = None

    venue: str

    opponent: str | None = None

    description: str | None = None

    max_participants: int | None = None

    registration_deadline: date | None = None

    created_by: UUID

class UpdateEventRequest(BaseModel):

    title: str

    event_type: EventType

    date: date

    start_time: time

    end_time: time | None = None

    venue: str

    opponent: str | None = None

    description: str | None = None

    max_participants: int | None = None

    registration_deadline: date | None = None





class EventResponse(BaseModel):

    id: UUID

    team_id: UUID | None

    created_by: UUID

    title: str

    description: str | None

    event_type: EventType

    event_status: str

    date: date

    start_time: time

    end_time: time | None

    venue: str

    opponent: str | None

    max_participants: int | None

    registration_deadline: date | None

    is_registration_open: bool

    created_at: datetime

    class Config:
        from_attributes = True

    