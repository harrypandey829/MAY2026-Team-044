from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.announcement_schema import (
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
    AnnouncementResponse
)

from app.services.announcement_service import AnnouncementService

router = APIRouter(
    prefix="/announcements",
    tags=["Announcements"]
)

service = AnnouncementService()


@router.post(
    "",
    response_model=AnnouncementResponse,
    status_code=201
)
def create_announcement(
    request: CreateAnnouncementRequest,
    db: Session = Depends(get_db)
):

    return service.create(
        db,
        request
    )


@router.get(
    "",
    response_model=list[AnnouncementResponse]
)
def get_all_announcements(
    db: Session = Depends(get_db)
):

    return service.get_all(db)


@router.get(
    "/{announcement_id}",
    response_model=AnnouncementResponse
)
def get_announcement(
    announcement_id: UUID,
    db: Session = Depends(get_db)
):

    announcement = service.get_by_id(
        db,
        announcement_id
    )

    if announcement is None:

        raise HTTPException(
            status_code=404,
            detail="Announcement not found"
        )

    return announcement


@router.put(
    "/{announcement_id}",
    response_model=AnnouncementResponse
)
def update_announcement(
    announcement_id: UUID,
    request: UpdateAnnouncementRequest,
    db: Session = Depends(get_db)
):

    announcement = service.update(
        db,
        announcement_id,
        request
    )

    if announcement is None:

        raise HTTPException(
            status_code=404,
            detail="Announcement not found"
        )

    return announcement


@router.delete(
    "/{announcement_id}"
)
def delete_announcement(
    announcement_id: UUID,
    db: Session = Depends(get_db)
):

    deleted = service.delete(
        db,
        announcement_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Announcement not found"
        )

    return {

        "message": "Announcement deleted successfully"
    }