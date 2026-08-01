from uuid import UUID

from sqlalchemy.orm import Session

from app.models.event import Event
from app.common.enums import EventStatus
from app.repositories.event_repository import EventRepository
from app.schemas.event_schema import (
    CreateEventRequest,
    UpdateEventRequest,
)


class EventService:

    def __init__(self):

        self.repository = EventRepository()

    def create_event(
        self,
        db: Session,
        request: CreateEventRequest
    ):

        event = Event(

            team_id=request.team_id,

            created_by=request.created_by,

            title=request.title,

            event_type=request.event_type,

            date=request.date,

            start_time=request.start_time,

            venue=request.venue,

            opponent=request.opponent,

            description=request.description,
            end_time=request.end_time,

            max_participants=request.max_participants,

            registration_deadline=request.registration_deadline,

            event_status=EventStatus.SCHEDULED,

            is_registration_open=True
        )

        return self.repository.create(
            db,
            event
        )

    def get_event_by_id(
        self,
        db: Session,
        event_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            event_id
        )

    def get_all_events(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def update_event(
        self,
        db: Session,
        event_id: UUID,
        request: UpdateEventRequest
    ):

        event = self.repository.get_by_id(
            db,
            event_id
        )

        if event is None:

            return None

        event.title = request.title

        event.event_type = request.event_type

        event.date = request.date

        event.start_time = request.start_time
        event.end_time = request.end_time

        event.max_participants = request.max_participants

        event.registration_deadline = request.registration_deadline

        event.venue = request.venue

        event.opponent = request.opponent

        event.description = request.description

        return self.repository.update(
            db,
            event
        )

    def cancel_event(
        self,
        db: Session,
        event_id: UUID
    ):

        event = self.repository.get_by_id(
            db,
            event_id
        )

        if event is None:

            return None

        event.event_status = EventStatus.CANCELLED

        event.is_registration_open = False

        return self.repository.update(
            db,
            event
        )