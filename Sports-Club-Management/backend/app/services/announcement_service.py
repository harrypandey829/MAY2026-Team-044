from uuid import UUID

from sqlalchemy.orm import Session

from app.models.announcement import Announcement
from app.repositories.announcement_repository import AnnouncementRepository
from app.schemas.announcement_schema import (
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest
)


class AnnouncementService:

    def __init__(self):

        self.repository = AnnouncementRepository()

    def create(
        self,
        db: Session,
        request: CreateAnnouncementRequest
    ):

        announcement = Announcement(

            title=request.title,

            message=request.message,

            created_by=request.created_by
        )

        return self.repository.create(
            db,
            announcement
        )

    def get_all(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        announcement_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            announcement_id
        )

    def update(
        self,
        db: Session,
        announcement_id: UUID,
        request: UpdateAnnouncementRequest
    ):

        announcement = self.repository.get_by_id(
            db,
            announcement_id
        )

        if announcement is None:

            return None

        announcement.title = request.title

        announcement.message = request.message

        return self.repository.update(
            db,
            announcement
        )

    def delete(
        self,
        db: Session,
        announcement_id: UUID
    ):

        announcement = self.repository.get_by_id(
            db,
            announcement_id
        )

        if announcement is None:

            return False

        self.repository.delete(
            db,
            announcement
        )

        return True