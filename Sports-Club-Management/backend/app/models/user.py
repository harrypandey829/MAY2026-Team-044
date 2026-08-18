import uuid

from sqlalchemy import String, Boolean
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin
from app.common.enums import UserRole


class User(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "users"

    first_name: Mapped[str] = mapped_column(String(100), nullable=False)

    last_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    phone: Mapped[str | None] = mapped_column(String(20))

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        nullable=False
    )

    profile_picture_url: Mapped[str | None] = mapped_column(String(255))

    # Additional fields that exist in the existing DB schema
    is_approved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Active"
    )

    sport: Mapped[str | None] = mapped_column(String(50), nullable=True)

    address: Mapped[str | None] = mapped_column(String(255), nullable=True)