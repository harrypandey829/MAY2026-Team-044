from decimal import Decimal

from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import Text
from sqlalchemy import UniqueConstraint

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin


class PerformanceRecord(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "performance_records"

    __table_args__ = (
        UniqueConstraint(
            "event_id",
            "user_id",
            name="uq_event_user_performance"
        ),
    )

    event_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events.id"),
        nullable=False
    )

    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    goals: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    assists: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    yellow_cards: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    red_cards: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    minutes_played: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    match_rating: Mapped[Decimal | None] = mapped_column(
        Numeric(3, 1)
    )

    remarks: Mapped[str | None] = mapped_column(
        Text
    )

    created_by: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )