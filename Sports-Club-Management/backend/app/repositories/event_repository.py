from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.event import Event


class EventRepository:

    def create(
        self,
        db: Session,
        event: Event
    ) -> Event:

        db.add(event)

        db.commit()

        db.refresh(event)

        return event

    def get_by_id(
        self,
        db: Session,
        event_id: UUID
    ) -> Event | None:

        stmt = (
            select(Event)
            .where(Event.id == event_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_all(
        self,
        db: Session
    ):

        stmt = (
            select(Event)
            .order_by(Event.date)
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def update(
        self,
        db: Session,
        event: Event
    ):

        db.commit()

        db.refresh(event)

        return event

    def cancel(
    self,
    db: Session,
    event: Event
):
        event.is_cancelled = True
        db.commit()
        db.refresh(event)
        return event