from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SQLEnum

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin

from app.common.enums import AttendanceStatus


class Attendance(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "attendance"

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

    status: Mapped[AttendanceStatus] = mapped_column(
        SQLEnum(AttendanceStatus),
        nullable=False
    )

    remarks: Mapped[str | None] = mapped_column(
        Text
    )

    marked_by: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )