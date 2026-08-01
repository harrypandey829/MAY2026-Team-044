from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_booking import ResourceBooking


class ResourceBookingRepository:

    def create(
        self,
        db: Session,
        booking: ResourceBooking
    ):

        db.add(booking)

        db.commit()

        db.refresh(booking)

        return booking

    def get_all(
        self,
        db: Session
    ):

        stmt = (
            select(ResourceBooking)
            .order_by(ResourceBooking.booking_date)
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        booking_id: UUID
    ):

        stmt = (
            select(ResourceBooking)
            .where(ResourceBooking.id == booking_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def update(
        self,
        db: Session,
        booking: ResourceBooking
    ):

        db.commit()

        db.refresh(booking)

        return booking

    def delete(
        self,
        db: Session,
        booking: ResourceBooking
    ):

        db.delete(booking)

        db.commit()