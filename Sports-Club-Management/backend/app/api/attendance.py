from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.attendance_schema import (
    AttendanceResponse,
    MarkAttendanceRequest
)
from app.services.attendance_service import AttendanceService

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

service = AttendanceService()


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=201
)
def mark_attendance(
    request: MarkAttendanceRequest,
    db: Session = Depends(get_db)
):

    result = service.mark_attendance(
        db,
        request
    )

    if result == "not_registered":

        raise HTTPException(
            status_code=400,
            detail="Member not registered for this event"
        )

    if result == "already_marked":

        raise HTTPException(
            status_code=400,
            detail="Attendance already marked"
        )

    return result


@router.get(
    "/member/{member_id}",
    response_model=list[AttendanceResponse]
)
def member_history(
    member_id: UUID,
    db: Session = Depends(get_db)
):

    return service.member_history(
        db,
        member_id
    )


@router.get(
    "/event/{event_id}",
    response_model=list[AttendanceResponse]
)
def event_report(
    event_id: UUID,
    db: Session = Depends(get_db)
):

    return service.event_report(
        db,
        event_id
    )