from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.resource_booking_schema import (
    CreateResourceBookingRequest,
    UpdateResourceBookingRequest,
    ResourceBookingResponse
)

from app.services.resource_booking_service import (
    ResourceBookingService
)

router = APIRouter(

    prefix="/resource-bookings",

    tags=["Resource Bookings"]

)

service = ResourceBookingService()


@router.post(
    "",
    response_model=ResourceBookingResponse,
    status_code=201
)
def create_booking(
    request: CreateResourceBookingRequest,
    db: Session = Depends(get_db)
):

    return service.create(
        db,
        request
    )


@router.get(
    "",
    response_model=list[ResourceBookingResponse]
)
def get_all_bookings(
    db: Session = Depends(get_db)
):

    return service.get_all(db)


@router.get(
    "/{booking_id}",
    response_model=ResourceBookingResponse
)
def get_booking(
    booking_id: UUID,
    db: Session = Depends(get_db)
):

    booking = service.get_by_id(
        db,
        booking_id
    )

    if booking is None:

        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking


@router.put(
    "/{booking_id}",
    response_model=ResourceBookingResponse
)
def update_booking(
    booking_id: UUID,
    request: UpdateResourceBookingRequest,
    db: Session = Depends(get_db)
):

    booking = service.update(
        db,
        booking_id,
        request
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking



@router.put(
    "/{booking_id}/status",
    response_model=ResourceBookingResponse
)
def update_booking_status(
    booking_id: UUID,
    status: str,
    remarks: str | None = None,
    db: Session = Depends(get_db)
):
    booking = service.update_status(
        db,
        booking_id,
        status,
        remarks
    )
    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )
    return booking



@router.delete("/{booking_id}")
def delete_booking(
    booking_id: UUID,
    db: Session = Depends(get_db)
):

    deleted = service.delete(
        db,
        booking_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return {

        "message": "Booking deleted successfully"
    }