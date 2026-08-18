from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base_model import UUIDMixin, TimestampMixin

class Sport(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sports"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    monthly_fee: Mapped[float] = mapped_column(Float, default=0.0)
    annual_fee: Mapped[float] = mapped_column(Float, default=0.0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
