from datetime import datetime, timezone
from uuid import UUID

from pydantic import BaseModel, model_validator

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

    @model_validator(mode='before')
    def map_attendance_fields(cls, values):
        if hasattr(values, '__dict__'):
            obj = values
            marked_at_val = getattr(obj, "created_at", None) or getattr(obj, "marked_at", None) or datetime.now(timezone.utc)
            return {
                "id": getattr(obj, "id", None),
                "event_id": getattr(obj, "event_id", None),
                "member_id": getattr(obj, "user_id", getattr(obj, "member_id", None)),
                "attendance_status": getattr(obj, "status", getattr(obj, "attendance_status", None)),
                "remarks": getattr(obj, "remarks", None),
                "marked_at": marked_at_val,
            }
        elif isinstance(values, dict):
            marked_at_val = values.get("created_at") or values.get("marked_at") or datetime.now(timezone.utc)
            return {
                "id": values.get("id"),
                "event_id": values.get("event_id"),
                "member_id": values.get("user_id") or values.get("member_id"),
                "attendance_status": values.get("status") or values.get("attendance_status"),
                "remarks": values.get("remarks"),
                "marked_at": marked_at_val,
            }
        return values
