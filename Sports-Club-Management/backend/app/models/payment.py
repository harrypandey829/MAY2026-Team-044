from datetime import date

from sqlalchemy import Date
from sqlalchemy import Numeric
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SQLEnum

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.base import Base
from app.models.base_model import UUIDMixin
from app.models.base_model import TimestampMixin

from app.common.enums import PaymentModel
from app.common.enums import InvoiceStatus


class Payment(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "payments"

    member_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10,2),
        nullable=False
    )

    payment_model: Mapped[PaymentModel] = mapped_column(
        SQLEnum(PaymentModel),
        nullable=False
    )

    invoice_status: Mapped[InvoiceStatus] = mapped_column(
        SQLEnum(InvoiceStatus),
        nullable=False
    )

    due_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    paid_date: Mapped[date | None] = mapped_column(
        Date
    )