from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin


class MatchResult(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "match_results"

    event_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events.id"),
        nullable=False,
        unique=True
    )

    home_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    away_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    winner: Mapped[str | None] = mapped_column(
        String(100)
    )

    mvp_user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    notes: Mapped[str | None] = mapped_column(
        Text
    )