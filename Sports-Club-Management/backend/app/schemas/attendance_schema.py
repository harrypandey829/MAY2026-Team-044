from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.common.enums import AttendanceStatus


class MarkAttendanceRequest(BaseModel):

    event_id: UUID

    member_id: UUID

    attendance_status: AttendanceStatus

    remarks: str | None = None


class AttendanceResponse(BaseModel):

    id: UUID

    event_id: UUID

    member_id: UUID

    attendance_status: AttendanceStatus

    remarks: str | None

    marked_at: datetime

    class Config:

        from_attributes = True