from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Boolean

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin


class Resource(
    Base,
    UUIDMixin
):

    __tablename__ = "resources"

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )