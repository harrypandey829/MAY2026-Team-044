from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SQLEnum

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin

from app.common.enums import RegistrationStatus


class EventRegistration(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "event_registrations"

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

    status: Mapped[RegistrationStatus] = mapped_column(
        SQLEnum(RegistrationStatus),
        nullable=False
    )