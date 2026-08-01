from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.event_registration_repository import (
    EventRegistrationRepository
)
from app.schemas.attendance_schema import MarkAttendanceRequest


class AttendanceService:

    def __init__(self):

        self.repository = AttendanceRepository()

        self.registration_repository = (
            EventRegistrationRepository()
        )

    def mark_attendance(
        self,
        db: Session,
        request: MarkAttendanceRequest
    ):

        registration = (
            self.registration_repository.already_registered(
                db,
                request.event_id,
                request.member_id
            )
        )

        if registration is None:

            return "not_registered"

        existing = self.repository.already_marked(
            db,
            request.event_id,
            request.member_id
        )

        if existing:

            return "already_marked"

        attendance = Attendance(

            event_id=request.event_id,

            member_id=request.member_id,

            attendance_status=request.attendance_status,

            remarks=request.remarks
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