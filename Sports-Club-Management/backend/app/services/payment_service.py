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

        saved = self.repository.create(
            db,
            payment
        )
        return self._enrich_payment(db, saved)

    def get_payment(
        self,
        db: Session,
        payment_id: UUID
    ):
        payment = self.repository.get_by_id(
            db,
            payment_id
        )

        if payment is None:
            return None

        return self._enrich_payment(db, payment)

    def get_all_payments(
        self,
        db: Session
    ):
        payments = self.repository.get_all(db)
        return [self._enrich_payment(db, p) for p in payments]

    def _enrich_payment(self, db: Session, p: Payment):
        from app.models.user import User

        user = db.query(User).filter(User.id == p.member_id).first()
        m_name = f"{user.first_name} {user.last_name}" if user else None
        m_email = user.email if user else None

        return {
            "id": p.id,
            "member_id": p.member_id,
            "amount": p.amount,
            "payment_model": p.payment_model,
            "invoice_status": p.invoice_status,
            "due_date": p.due_date,
            "paid_date": p.paid_date,
            "created_at": p.created_at,
            "member_name": m_name,
            "member_email": m_email,
        }

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

        payment.amount = request.amount

        payment.payment_model = request.payment_model

        payment.invoice_status = request.invoice_status

        payment.due_date = request.due_date

        payment.paid_date = request.paid_date

        return self.repository.update(
            db,
            payment
        )