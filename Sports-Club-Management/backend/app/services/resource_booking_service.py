from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.resource_booking import ResourceBooking
from app.repositories.resource_booking_repository import ResourceBookingRepository
from app.schemas.resource_booking_schema import (
    CreateResourceBookingRequest,
    UpdateResourceBookingRequest
)

from datetime import time

def parse_time_val(v):
    if v is None:
        return None
    if isinstance(v, time):
        return v
    if isinstance(v, str):
        v = v.strip()
        if not v:
            return None
        try:
            parts = v.split(":")
            return time(int(parts[0]), int(parts[1]))
        except Exception:
            return None
    return None

class ResourceBookingService:
    def __init__(self):
        self.repository = ResourceBookingRepository()

    def create(self, db: Session, request: CreateResourceBookingRequest):
        start_t = parse_time_val(request.start_time)
        end_t = parse_time_val(request.end_time)

        # 1. Overlap Validation
        if request.venue_name and request.booking_date and start_t and end_t:
            existing_bookings = db.query(ResourceBooking).filter(
                ResourceBooking.venue_name == request.venue_name,
                ResourceBooking.booking_date == request.booking_date,
                ResourceBooking.status != "REJECTED",
                ResourceBooking.is_cancelled == False
            ).all()

            for b in existing_bookings:
                if b.start_time and b.end_time:
                    # Slot overlap condition: (new_start < existing_end AND new_end > existing_start)
                    if start_t < b.end_time and end_t > b.start_time:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Conflict: Venue '{request.venue_name}' is already requested/booked for time slot {b.start_time}-{b.end_time} on {request.booking_date}."
                        )

        booking = ResourceBooking(
            resource_id=request.resource_id,
            member_id=request.member_id,
            coach_id=request.coach_id,
            sport_name=request.sport_name,
            venue_name=request.venue_name,
            booking_date=request.booking_date,
            start_time=start_t,
            end_time=end_t,
            duration_hours=request.duration_hours,
            status="PENDING",
            remarks=request.remarks,
            is_cancelled=False
        )

        return self.repository.create(db, booking)

    def get_all(self, db: Session):
        return self.repository.get_all(db)

    def get_by_id(self, db: Session, booking_id: UUID):
        return self.repository.get_by_id(db, booking_id)

    def update(self, db: Session, booking_id: UUID, request: UpdateResourceBookingRequest):
        booking = self.repository.get_by_id(db, booking_id)
        if booking is None:
            return None

        booking.booking_date = request.booking_date
        booking.duration_hours = request.duration_hours
        booking.is_cancelled = request.is_cancelled
        return self.repository.update(db, booking)

    def update_status(self, db: Session, booking_id: UUID, status: str, remarks: str | None = None):
        booking = self.repository.get_by_id(db, booking_id)
        if booking is None:
            return None
        booking.status = status
        if remarks:
            booking.remarks = remarks
        return self.repository.update(db, booking)

    def delete(self, db: Session, booking_id: UUID):
        booking = self.repository.get_by_id(db, booking_id)
        if booking is None:
            return False
        self.repository.delete(db, booking)
        return True