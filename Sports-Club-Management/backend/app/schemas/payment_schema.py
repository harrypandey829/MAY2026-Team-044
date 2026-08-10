from uuid import UUID
from decimal import Decimal
from datetime import date, datetime

from pydantic import BaseModel

from app.common.enums import PaymentModel
from app.common.enums import InvoiceStatus


class CreatePaymentRequest(BaseModel):

    member_id: UUID
    amount: Decimal
    payment_model: PaymentModel
    invoice_status: InvoiceStatus
    due_date: date
    paid_date: date | None = None


class UpdatePaymentRequest(BaseModel):

    amount: Decimal
    payment_model: PaymentModel
    invoice_status: InvoiceStatus
    due_date: date
    paid_date: date | None = None


class PaymentResponse(BaseModel):

    id: UUID
    member_id: UUID
    amount: Decimal
    payment_model: PaymentModel
    invoice_status: InvoiceStatus
    due_date: date
    paid_date: date | None
    created_at: datetime

    class Config:
        from_attributes = True