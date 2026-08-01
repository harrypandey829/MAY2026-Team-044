from sqlalchemy import Integer
from sqlalchemy import ForeignKey

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin


class PerformanceStatistics(Base, UUIDMixin):

    __tablename__ = "performance_statistics"

    member_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    matches_played: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    wins: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    losses: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    draws: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    goals: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    assists: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    yellow_cards: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    red_cards: Mapped[int] = mapped_column(
        Integer,
        default=0
    )