from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.performance_record import PerformanceRecord


class PerformanceRepository:

    def create(
        self,
        db: Session,
        performance: PerformanceRecord
    ):

        db.add(performance)

        db.commit()

        db.refresh(performance)

        return performance

    def get_all(
        self,
        db: Session
    ):
        stmt = select(PerformanceRecord)
        result = db.execute(stmt)
        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        performance_id: UUID
    ):

        stmt = (
            select(PerformanceRecord)
            .where(
                PerformanceRecord.id == performance_id
            )
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_by_member(
        self,
        db: Session,
        member_id: UUID
    ):

        stmt = (
            select(PerformanceRecord)
            .where(
                PerformanceRecord.member_id == member_id
            )
            .order_by(
                PerformanceRecord.created_at.desc()
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_by_event(
        self,
        db: Session,
        event_id: UUID
    ):

        stmt = (
            select(PerformanceRecord)
            .where(
                PerformanceRecord.event_id == event_id
            )
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def update(
        self,
        db: Session,
        performance: PerformanceRecord
    ):

        db.commit()

        db.refresh(performance)

        return performance

    def delete(
        self,
        db: Session,
        performance: PerformanceRecord
    ):

        db.delete(performance)

        db.commit()