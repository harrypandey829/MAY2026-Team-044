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

        saved = self.repository.create(
            db,
            booking
        )
        return self._enrich_booking(db, saved)

    def get_all(
        self,
        db: Session
    ):
        bookings = self.repository.get_all(db)
        return [self._enrich_booking(db, b) for b in bookings]

    def get_by_id(
        self,
        db: Session,
        booking_id: UUID
    ):
        booking = self.repository.get_by_id(
            db,
            booking_id
        )

        if booking is None:
            return None

        return self._enrich_booking(db, booking)

    def _enrich_booking(self, db: Session, b: ResourceBooking):
        from app.models.user import User
        from app.models.resource import Resource

        user = db.query(User).filter(User.id == b.member_id).first()
        resource = db.query(Resource).filter(Resource.id == b.resource_id).first()

        user_name = f"{user.first_name} {user.last_name}" if user else None
        user_role = (user.role.value if hasattr(user.role, 'value') else str(user.role)) if user else None
        resource_name = resource.name if resource else None

        # Return dict matching ResourceBookingResponse schema
        return {
            "id": b.id,
            "resource_id": b.resource_id,
            "member_id": b.member_id,
            "booking_date": b.booking_date,
            "duration_hours": b.duration_hours,
            "is_cancelled": b.is_cancelled,
            "created_at": b.created_at,
            "user_name": user_name,
            "user_role": user_role,
            "resource_name": resource_name,
        }

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