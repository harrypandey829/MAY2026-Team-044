from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.notification_schema import (
    CreateNotificationRequest,
    NotificationResponse
)

from app.services.notification_service import NotificationService

router = APIRouter(

    prefix="/notifications",

    tags=["Notifications"]

)

service = NotificationService()


@router.post(
    "",
    response_model=NotificationResponse,
    status_code=201
)
def create_notification(
    request: CreateNotificationRequest,
    db: Session = Depends(get_db)
):

    return service.create(
        db,
        request
    )


@router.get(
    "",
    response_model=list[NotificationResponse]
)
def get_notifications(
    db: Session = Depends(get_db)
):

    return service.get_all(db)


@router.get(
    "/{notification_id}",
    response_model=NotificationResponse
)
def get_notification(
    notification_id: UUID,
    db: Session = Depends(get_db)
):

    notification = service.get_by_id(
        db,
        notification_id
    )

    if notification is None:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
def mark_as_read(
    notification_id: UUID,
    db: Session = Depends(get_db)
):

    notification = service.mark_as_read(
        db,
        notification_id
    )

    if notification is None:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: UUID,
    db: Session = Depends(get_db)
):

    deleted = service.delete(
        db,
        notification_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {

        "message": "Notification deleted successfully"
    }