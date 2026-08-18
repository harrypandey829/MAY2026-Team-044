from datetime import date, time
from sqlalchemy import Date, Time, Integer, Boolean, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base_model import UUIDMixin, TimestampMixin

class ResourceBooking(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "resource_bookings"

    resource_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("resources.id"), nullable=True)
    member_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    coach_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    sport_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    venue_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    booking_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    duration_hours: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    status: Mapped[str] = mapped_column(String(50), default="APPROVED")  # PENDING, APPROVED, REJECTED
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_cancelled: Mapped[bool] = mapped_column(Boolean, default=False)