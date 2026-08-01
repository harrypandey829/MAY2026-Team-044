from uuid import UUID

from sqlalchemy.orm import Session

from app.models.performance_record import PerformanceRecord
from app.repositories.performance_repository import PerformanceRepository
from app.schemas.performance_schema import (
    CreatePerformanceRequest,
    UpdatePerformanceRequest
)


class PerformanceService:

    def __init__(self):

        self.repository = PerformanceRepository()

    def create_performance(
        self,
        db: Session,
        request: CreatePerformanceRequest
    ):

        performance = PerformanceRecord(

            member_id=request.member_id,

            event_id=request.event_id,

            goals=request.goals,

            assists=request.assists,

            yellow_cards=request.yellow_cards,

            red_cards=request.red_cards,

            minutes_played=request.minutes_played,

            rating=request.rating,

            remarks=request.remarks
        )

        return self.repository.create(
            db,
            performance
        )

    def get_performance_by_id(
        self,
        db: Session,
        performance_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            performance_id
        )

    def get_member_history(
        self,
        db: Session,
        member_id: UUID
    ):

        return self.repository.get_by_member(
            db,
            member_id
        )

    def get_event_performance(
        self,
        db: Session,
        event_id: UUID
    ):

        return self.repository.get_by_event(
            db,
            event_id
        )

    def update_performance(
        self,
        db: Session,
        performance_id: UUID,
        request: UpdatePerformanceRequest
    ):

        performance = self.repository.get_by_id(
            db,
            performance_id
        )

        if performance is None:

            return None

        performance.goals = request.goals

        performance.assists = request.assists

        performance.yellow_cards = request.yellow_cards

        performance.red_cards = request.red_cards

        performance.minutes_played = request.minutes_played

        performance.rating = request.rating

        performance.remarks = request.remarks

        return self.repository.update(
            db,
            performance
        )

    def delete_performance(
        self,
        db: Session,
        performance_id: UUID
    ):

        performance = self.repository.get_by_id(
            db,
            performance_id
        )

        if performance is None:

            return False

        self.repository.delete(
            db,
            performance
        )

        return True