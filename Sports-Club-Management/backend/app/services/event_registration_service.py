from sqlalchemy.orm import Session

from app.common.enums import RegistrationStatus
from app.models.event_registration import EventRegistration
from app.repositories.event_registration_repository import (
    EventRegistrationRepository
)
from app.repositories.event_repository import EventRepository
from app.repositories.user_repository import UserRepository
from app.schemas.event_registration_schema import RegisterEventRequest


class EventRegistrationService:

    def __init__(self):

        self.registration_repository = EventRegistrationRepository()

        self.event_repository = EventRepository()

        self.user_repository = UserRepository()

    def register(
        self,
        db: Session,
        request: RegisterEventRequest
    ):

        # Event exists?

        event = self.event_repository.get_by_id(
            db,
            request.event_id
        )

        if event is None:

            return None

        # Member exists?

        member = self.user_repository.get_by_id(
            db,
            request.member_id
        )

        if member is None:

            return "member_not_found"

        # Registration open?

        if not event.is_registration_open:

            return "registration_closed"

        # Already registered?

        existing = (
            self.registration_repository.already_registered(
                db,
                request.event_id,
                request.member_id
            )
        )

        if existing:

            return "already_registered"

        # Max participants reached?

        if event.max_participants is not None:

            total = (
                self.registration_repository.count_registered(
                    db,
                    request.event_id
                )
            )

            if total >= event.max_participants:

                return "event_full"

        registration = EventRegistration(
            event_id=request.event_id,
            user_id=request.member_id,
            status=RegistrationStatus.REGISTERED
        )

        return self.registration_repository.create(
            db,
            registration
        )

    def get_registered_members(
        self,
        db: Session,
        event_id
    ):
        return self.registration_repository.get_by_event(
            db,
            event_id
        )

    def get_registrations_by_member(
        self,
        db: Session,
        member_id
    ):
        return self.registration_repository.get_by_user(
            db,
            member_id
        )

    def unregister(
        self,
        db: Session,
        event_id,
        member_id
    ):
        existing = self.registration_repository.already_registered(
            db,
            event_id,
            member_id
        )
        if existing is None:
            return False
        self.registration_repository.delete(db, existing)
        return True