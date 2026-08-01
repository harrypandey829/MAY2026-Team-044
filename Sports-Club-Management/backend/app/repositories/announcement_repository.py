from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.announcement import Announcement


class AnnouncementRepository:

    def create(
        self,
        db: Session,
        announcement: Announcement
    ):

        db.add(announcement)

        db.commit()

        db.refresh(announcement)

        return announcement

    def get_all(
        self,
        db: Session
    ):

        stmt = (
            select(Announcement)
            .order_by(
                Announcement.created_at.desc()
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        announcement_id: UUID
    ):

        stmt = (
            select(Announcement)
            .where(
                Announcement.id == announcement_id
            )
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def update(
        self,
        db: Session,
        announcement: Announcement
    ):

        db.commit()

        db.refresh(announcement)

        return announcement

    def delete(
        self,
        db: Session,
        announcement: Announcement
    ):

        db.delete(announcement)

        db.commit()