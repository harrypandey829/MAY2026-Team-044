from datetime import date, time
from sqlalchemy import Date, Time, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base_model import UUIDMixin, TimestampMixin

class ResourceBooking(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "resource_bookings"

    resource_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("resources.id"), nullable=False)
    member_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    booking_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=True)
    end_time: Mapped[time] = mapped_column(Time, nullable=True)
    duration_hours: Mapped[int] = mapped_column(Integer, nullable=True, default=1)
    is_cancelled: Mapped[bool] = mapped_column(Boolean, default=False)