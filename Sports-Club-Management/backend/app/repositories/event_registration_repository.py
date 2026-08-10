from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.event_registration import EventRegistration
from app.models.user import User

class EventRegistrationRepository:

    def create(
        self,
        db: Session,
        registration: EventRegistration
    ):

        db.add(registration)

        db.commit()

        db.refresh(registration)

        return registration

    def already_registered(
        self,
        db: Session,
        event_id: UUID,
        user_id: UUID
    ):

        stmt = (
            select(EventRegistration)
            .where(
                EventRegistration.event_id == event_id,
                EventRegistration.user_id == user_id
        ) )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_by_event(
        self,
        db: Session,
        event_id: UUID
    ):

        stmt = (
            select(EventRegistration)
            .where(
                EventRegistration.event_id == event_id
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def count_registered(
        self,
        db: Session,
        event_id: UUID
    ):

        stmt = (
            select(EventRegistration)
            .where(
                EventRegistration.event_id == event_id
            )
        )

        result = db.execute(stmt)

        return len(result.scalars().all())
    def get_by_user(
        self,
        db: Session,
        user_id: UUID
    ):
        stmt = (
            select(EventRegistration)
            .where(
                EventRegistration.user_id == user_id
            )
        )
        result = db.execute(stmt)
        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        user_id: UUID
    ):
        stmt = (
            select(User)
            .where(User.id == user_id)
        )
        result = db.execute(stmt)
        return result.scalar_one_or_none()

    def delete(
        self,
        db: Session,
        registration: EventRegistration
    ):
        db.delete(registration)
        db.commit()