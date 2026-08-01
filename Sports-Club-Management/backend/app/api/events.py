from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.event_schema import (
    CreateEventRequest,
    UpdateEventRequest,
    EventResponse
)
from app.services.event_service import EventService

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

service = EventService()


@router.post(
    "",
    response_model=EventResponse,
    status_code=201
)
def create_event(
    request: CreateEventRequest,
    db: Session = Depends(get_db)
):

    return service.create_event(
        db,
        request
    )


@router.get(
    "",
    response_model=list[EventResponse]
)
def get_all_events(
    db: Session = Depends(get_db)
):

    return service.get_all_events(db)


@router.get(
    "/{event_id}",
    response_model=EventResponse
)
def get_event(
    event_id: UUID,
    db: Session = Depends(get_db)
):

    event = service.get_event_by_id(
        db,
        event_id
    )

    if event is None:

        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event


@router.put(
    "/{event_id}",
    response_model=EventResponse
)
def update_event(
    event_id: UUID,
    request: UpdateEventRequest,
    db: Session = Depends(get_db)
):

    event = service.update_event(
        db,
        event_id,
        request
    )

    if event is None:

        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event


@router.patch(
    "/{event_id}/cancel",
    response_model=EventResponse
)
def cancel_event(
    event_id: UUID,
    db: Session = Depends(get_db)
):

    event = service.cancel_event(
        db,
        event_id
    )

    if event is None:

        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event