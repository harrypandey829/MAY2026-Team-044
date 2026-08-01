from uuid import UUID

from sqlalchemy.orm import Session

from app.models.resource_booking import ResourceBooking

from app.repositories.resource_booking_repository import (
    ResourceBookingRepository
)

from app.schemas.resource_booking_schema import (
    CreateResourceBookingRequest,
    UpdateResourceBookingRequest
)


class ResourceBookingService:

    def __init__(self):

        self.repository = ResourceBookingRepository()

    def create(
        self,
        db: Session,
        request: CreateResourceBookingRequest
    ):

        booking = ResourceBooking(

            resource_id=request.resource_id,

            member_id=request.member_id,

            booking_date=request.booking_date,

            duration_hours=request.duration_hours,

            is_cancelled=False
        )

        return self.repository.create(
            db,
            booking
        )

    def get_all(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        booking_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            booking_id
        )

    def update(
        self,
        db: Session,
        booking_id: UUID,
        request: UpdateResourceBookingRequest
    ):

        booking = self.repository.get_by_id(
            db,
            booking_id
        )

        if booking is None:

            return None

        booking.booking_date = request.booking_date

        booking.duration_hours = request.duration_hours

        booking.is_cancelled = request.is_cancelled

        return self.repository.update(
            db,
            booking
        )

    def delete(
        self,
        db: Session,
        booking_id: UUID
    ):

        booking = self.repository.get_by_id(
            db,
            booking_id
        )

        if booking is None:

            return False

        self.repository.delete(
            db,
            booking
        )

        return True