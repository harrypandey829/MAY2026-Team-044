from decimal import Decimal
from sqlalchemy import ForeignKey, Integer, Numeric, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, synonym
from app.db.base import Base
from app.models.base_model import UUIDMixin, TimestampMixin

class PerformanceRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "performance_records"

    event_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    member_id = synonym("user_id")

    goals: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    assists: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    yellow_cards: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    red_cards: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    minutes_played: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    match_rating: Mapped[Decimal | None] = mapped_column(Numeric(3, 1), nullable=True)
    rating = synonym("match_rating")
    
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)