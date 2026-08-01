from sqlalchemy import ForeignKey
from sqlalchemy import Text

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin


class PracticePlan(Base, UUIDMixin):

    __tablename__ = "practice_plans"

    event_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events.id"),
        unique=True,
        nullable=False
    )

    warm_up: Mapped[str | None] = mapped_column(Text)

    drills: Mapped[str | None] = mapped_column(Text)

    fitness: Mapped[str | None] = mapped_column(Text)

    match_practice: Mapped[str | None] = mapped_column(Text)

    notes: Mapped[str | None] = mapped_column(Text)