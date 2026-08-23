from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payment import Payment


class PaymentRepository:

    def create(
        self,
        db: Session,
        payment: Payment
    ):

        db.add(payment)

        db.commit()

        db.refresh(payment)

        return payment

    def get_by_id(
        self,
        db: Session,
        payment_id: UUID
    ):

        stmt = (
            select(Payment)
            .where(Payment.id == payment_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_all(
        self,
        db: Session,
        member_id: UUID | None = None
    ):

        stmt = select(Payment)
        if member_id:
            stmt = stmt.where(Payment.member_id == member_id)
        stmt = stmt.order_by(Payment.created_at.desc())

        result = db.execute(stmt)

        return result.scalars().all()

    def update(
        self,
        db: Session,
        payment: Payment
    ):

        db.commit()

        db.refresh(payment)

        return payment