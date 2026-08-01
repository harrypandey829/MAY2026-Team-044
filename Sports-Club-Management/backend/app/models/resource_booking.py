from datetime import date
from datetime import time

from sqlalchemy import Date
from sqlalchemy import Time
from sqlalchemy import ForeignKey

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin


class ResourceBooking(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "resource_bookings"

    resource_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resources.id"),
        nullable=False
    )

    member_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    booking_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )