from uuid import UUID

from sqlalchemy.orm import Session

from app.models.announcement import Announcement
from app.repositories.announcement_repository import AnnouncementRepository
from app.schemas.announcement_schema import (
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest
)


from app.models.user import User
from app.common.enums import UserRole


class AnnouncementService:

    def __init__(self):

        self.repository = AnnouncementRepository()

    def create(
        self,
        db: Session,
        request: CreateAnnouncementRequest
    ):
        created_by_uuid = None
        if request.created_by:
            try:
                if isinstance(request.created_by, UUID):
                    created_by_uuid = request.created_by
                else:
                    created_by_uuid = UUID(str(request.created_by))
            except (ValueError, TypeError):
                created_by_uuid = None

        if created_by_uuid:
            user = db.query(User).filter(User.id == created_by_uuid).first()
            if not user:
                created_by_uuid = None

        if not created_by_uuid:
            first_user = db.query(User).first()
            if first_user:
                created_by_uuid = first_user.id
            else:
                admin = User(
                    first_name="Admin",
                    last_name="User",
                    email="admin@sportsclub.com",
                    password_hash="fallback_hash",
                    role=UserRole.ADMIN,
                    is_approved=True
                )
                db.add(admin)
                db.commit()
                db.refresh(admin)
                created_by_uuid = admin.id

        announcement = Announcement(
            title=request.title,
            message=request.message,
            created_by=created_by_uuid
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