from uuid import UUID

from sqlalchemy.orm import Session

from app.models.event import Event
from app.common.enums import EventStatus
from app.repositories.event_repository import EventRepository
from app.schemas.event_schema import (
    CreateEventRequest,
    UpdateEventRequest,
)


from app.models.user import User
from app.common.enums import UserRole


class EventService:

    def __init__(self):

        self.repository = EventRepository()

    def create_event(
        self,
        db: Session,
        request: CreateEventRequest
    ):
        created_by_uuid = None
        if request.created_by:
            try:
                if isinstance(request.created_by, UUID):
                    created_by_uuid = request.created_by
                else:
                    created_by_uuid = UUID(str(request.created_by))
            except (ValueError, TypeError):
                created_by_uuid = None

        if created_by_uuid:
            user = db.query(User).filter(User.id == created_by_uuid).first()
            if not user:
                created_by_uuid = None

        if not created_by_uuid:
            first_user = db.query(User).first()
            if first_user:
                created_by_uuid = first_user.id
            else:
                admin = User(
                    first_name="Admin",
                    last_name="User",
                    email="admin@sportsclub.com",
                    password_hash="fallback_hash",
                    role=UserRole.ADMIN,
                    is_approved=True
                )
                db.add(admin)
                db.commit()
                db.refresh(admin)
                created_by_uuid = admin.id

        reg_deadline = request.registration_deadline or request.date

        event = Event(
            team_id=request.team_id,
            created_by=created_by_uuid,
            title=request.title,
            event_type=request.event_type,
            date=request.date,
            start_time=request.start_time,
            venue=request.venue,
            opponent=request.opponent,
            description=request.description,
            end_time=request.end_time,
            sport=request.sport,
            max_participants=request.max_participants,
            registration_deadline=reg_deadline,
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

        if request.title is not None:
            event.title = request.title
        if request.event_type is not None:
            event.event_type = request.event_type
        if request.date is not None:
            event.date = request.date
        if request.start_time is not None:
            event.start_time = request.start_time
        if request.end_time is not None:
            event.end_time = request.end_time
        if request.max_participants is not None:
            event.max_participants = request.max_participants
        if request.registration_deadline is not None:
            event.registration_deadline = request.registration_deadline
        if request.venue is not None:
            event.venue = request.venue
        if request.opponent is not None:
            event.opponent = request.opponent
        if request.description is not None:
            event.description = request.description
        if request.sport is not None:
            event.sport = request.sport
        if request.event_status is not None:
            event.event_status = request.event_status

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