from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base_model import UUIDMixin, TimestampMixin

class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notifications"

    member_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=True)
    message: Mapped[str] = mapped_column(String(255), nullable=True)
    announcement_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("announcements.id"), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)