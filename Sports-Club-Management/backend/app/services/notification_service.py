from uuid import UUID

from sqlalchemy.orm import Session

from app.models.notification import Notification

from app.repositories.notification_repository import NotificationRepository

from app.schemas.notification_schema import (
    CreateNotificationRequest
)


class NotificationService:

    def __init__(self):

        self.repository = NotificationRepository()

    def create(
        self,
        db: Session,
        request: CreateNotificationRequest
    ):

        notification = Notification(

            member_id=request.member_id,

            title=request.title,

            message=request.message,

            is_read=False
        )

        return self.repository.create(
            db,
            notification
        )

    def get_all(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        notification_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            notification_id
        )

    def mark_as_read(
        self,
        db: Session,
        notification_id: UUID
    ):

        notification = self.repository.get_by_id(
            db,
            notification_id
        )

        if notification is None:

            return None

        notification.is_read = True

        return self.repository.update(
            db,
            notification
        )

    def delete(
        self,
        db: Session,
        notification_id: UUID
    ):

        notification = self.repository.get_by_id(
            db,
            notification_id
        )

        if notification is None:

            return False

        self.repository.delete(
            db,
            notification
        )

        return True