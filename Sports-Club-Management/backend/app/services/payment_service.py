from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment_schema import (
    CreatePaymentRequest,
    UpdatePaymentRequest
)


class PaymentService:

    def __init__(self):

        self.repository = PaymentRepository()

    def create_payment(
        self,
        db: Session,
        request: CreatePaymentRequest
    ):

        payment = Payment(

        member_id=request.member_id,

        amount=request.amount,

        payment_model=request.payment_model,

        invoice_status=request.invoice_status,

        due_date=request.due_date,

        paid_date=request.paid_date
    )

        return self.repository.create(
            db,
            payment
        )

    def get_payment(
        self,
        db: Session,
        payment_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            payment_id
        )

    def get_all_payments(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def update_payment(
        self,
        db: Session,
        payment_id: UUID,
        request: UpdatePaymentRequest
    ):

        payment = self.repository.get_by_id(
            db,
            payment_id
        )

        if payment is None:

            return None

        if request.amount is not None:
            payment.amount = request.amount

        if request.payment_model is not None:
            payment.payment_model = request.payment_model

        if request.invoice_status is not None:
            payment.invoice_status = request.invoice_status

        if request.due_date is not None:
            payment.due_date = request.due_date

        if request.paid_date is not None:
            payment.paid_date = request.paid_date

        return self.repository.update(
            db,
            payment
        )