from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.event_registration_schema import (
    RegisterEventRequest,
    RegistrationResponse
)
from app.services.event_registration_service import (
    EventRegistrationService
)

router = APIRouter(
    prefix="/event-registrations",
    tags=["Event Registration"]
)

service = EventRegistrationService()


@router.post(
    "",
    response_model=RegistrationResponse,
    status_code=201
)
def register(
    request: RegisterEventRequest,
    db: Session = Depends(get_db)
):

    result = service.register(
        db,
        request
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    if result == "member_not_found":

        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    if result == "registration_closed":

        raise HTTPException(
            status_code=400,
            detail="Registration closed"
        )

    if result == "already_registered":

        raise HTTPException(
            status_code=400,
            detail="Already registered"
        )

    if result == "event_full":

        raise HTTPException(
            status_code=400,
            detail="Event is full"
        )

    return result


@router.get(
    "/{event_id}",
    response_model=list[RegistrationResponse]
)
def get_registered_members(
    event_id: UUID,
    db: Session = Depends(get_db)
):

    return service.get_registered_members(
        db,
        event_id
    )


@router.get(
    "/member/{member_id}",
    response_model=list[RegistrationResponse]
)
def get_member_registrations(
    member_id: UUID,
    db: Session = Depends(get_db)
):
    return service.get_registrations_by_member(
        db,
        member_id
    )