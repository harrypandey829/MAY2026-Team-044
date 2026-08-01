from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreatePerformanceRequest(BaseModel):

    member_id: UUID

    event_id: UUID

    goals: int = 0

    assists: int = 0

    yellow_cards: int = 0

    red_cards: int = 0

    minutes_played: int = 0

    rating: float | None = None

    remarks: str | None = None


class UpdatePerformanceRequest(BaseModel):

    goals: int = 0

    assists: int = 0

    yellow_cards: int = 0

    red_cards: int = 0

    minutes_played: int = 0

    rating: float | None = None

    remarks: str | None = None


class PerformanceResponse(BaseModel):

    id: UUID

    member_id: UUID

    event_id: UUID

    goals: int

    assists: int

    yellow_cards: int

    red_cards: int

    minutes_played: int

    rating: float | None

    remarks: str | None

    created_at: datetime

    class Config:

        from_attributes = True