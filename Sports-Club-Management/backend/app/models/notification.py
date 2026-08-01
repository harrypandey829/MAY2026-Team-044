from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin


class Notification(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "notifications"

    member_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    announcement_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("announcements.id")
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )