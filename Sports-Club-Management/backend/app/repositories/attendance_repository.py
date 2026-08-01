from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance


class AttendanceRepository:

    def create(
        self,
        db: Session,
        attendance: Attendance
    ):

        db.add(attendance)

        db.commit()

        db.refresh(attendance)

        return attendance

    def already_marked(
        self,
        db: Session,
        event_id: UUID,
        member_id: UUID
    ):

        stmt = (
            select(Attendance)
            .where(
                Attendance.event_id == event_id,
                Attendance.user_id == member_id
            )
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_member_history(
        self,
        db: Session,
        member_id: UUID
    ):

        stmt = (
            select(Attendance)
            .where(
                Attendance.user_id == member_id
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_event_attendance(
        self,
        db: Session,
        event_id: UUID
    ):

        stmt = (
            select(Attendance)
            .where(
                Attendance.event_id == event_id
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()