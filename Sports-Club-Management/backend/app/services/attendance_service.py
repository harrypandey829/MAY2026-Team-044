from sqlalchemy.orm import Session

from app.common.enums import RegistrationStatus
from app.models.event_registration import EventRegistration
from app.models.attendance import Attendance
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.event_registration_repository import (
    EventRegistrationRepository
)
from app.repositories.event_repository import EventRepository
from app.repositories.user_repository import UserRepository
from app.schemas.attendance_schema import MarkAttendanceRequest


class AttendanceService:

    def __init__(self):

        self.repository = AttendanceRepository()

        self.registration_repository = (
            EventRegistrationRepository()
        )

        self.event_repository = EventRepository()

        self.user_repository = UserRepository()

    def mark_attendance(
        self,
        db: Session,
        request: MarkAttendanceRequest
    ):
        event = self.event_repository.get_by_id(db, request.event_id)
        member = self.user_repository.get_by_id(db, request.member_id)

        if event is None or member is None:
            return "not_registered"

        registration = (
            self.registration_repository.already_registered(
                db,
                request.event_id,
                request.member_id
            )
        )

        if registration is None:
            # Auto-register member for event so coach attendance logging is seamless
            new_registration = EventRegistration(
                event_id=request.event_id,
                user_id=request.member_id,
                status=RegistrationStatus.REGISTERED
            )
            self.registration_repository.create(db, new_registration)

        existing = self.repository.already_marked(
            db,
            request.event_id,
            request.member_id
        )

        if existing:
            existing.status = request.attendance_status
            if request.remarks is not None:
                existing.remarks = request.remarks
            if request.rating is not None:
                existing.rating = request.rating
            db.commit()
            db.refresh(existing)
            return existing

        attendance = Attendance(
            event_id=request.event_id,
            user_id=request.member_id,
            status=request.attendance_status,
            remarks=request.remarks,
            rating=request.rating,
            marked_by=request.member_id
        )

        return self.repository.create(
            db,
            attendance
        )

    def member_history(
        self,
        db: Session,
        member_id
    ):

        return self.repository.get_member_history(
            db,
            member_id
        )

    def event_report(
        self,
        db: Session,
        event_id
    ):

        return self.repository.get_event_attendance(
            db,
            event_id
        )