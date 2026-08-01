from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    def create(
        self,
        db: Session,
        notification: Notification
    ):

        db.add(notification)

        db.commit()

        db.refresh(notification)

        return notification

    def get_all(
        self,
        db: Session
    ):

        stmt = (
            select(Notification)
            .order_by(Notification.created_at.desc())
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        notification_id: UUID
    ):

        stmt = (
            select(Notification)
            .where(Notification.id == notification_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def update(
        self,
        db: Session,
        notification: Notification
    ):

        db.commit()

        db.refresh(notification)

        return notification

    def delete(
        self,
        db: Session,
        notification: Notification
    ):

        db.delete(notification)

        db.commit()