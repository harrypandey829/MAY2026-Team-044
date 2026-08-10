from datetime import date
from datetime import time

from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Date
from sqlalchemy import Time
from sqlalchemy import Integer
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SQLEnum

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin

from app.common.enums import EventType
from app.common.enums import EventStatus


class Event(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "events"

    team_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )

    created_by: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    event_type: Mapped[EventType] = mapped_column(
        SQLEnum(EventType),
        nullable=False
    )

    event_status: Mapped[EventStatus] = mapped_column(
        SQLEnum(EventStatus),
        nullable=False,
        default=EventStatus.SCHEDULED
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    end_time: Mapped[time | None] = mapped_column(
        Time
    )

    venue: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    opponent: Mapped[str | None] = mapped_column(
        String(100)
    )

    max_participants: Mapped[int | None] = mapped_column(
        Integer
    )

    registration_deadline: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    sport: Mapped[str | None] = mapped_column(
        String(50)
    )

    is_registration_open: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )