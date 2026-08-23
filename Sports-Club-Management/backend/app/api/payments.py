from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.payment_schema import (
    CreatePaymentRequest,
    UpdatePaymentRequest,
    PaymentResponse
)
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

service = PaymentService()


@router.post(
    "",
    response_model=PaymentResponse,
    status_code=201
)
def create_payment(
    request: CreatePaymentRequest,
    db: Session = Depends(get_db)
):

    return service.create_payment(
        db,
        request
    )


@router.get(
    "",
    response_model=list[PaymentResponse]
)
def get_all_payments(
    member_id: UUID | None = None,
    db: Session = Depends(get_db)
):

    return service.get_all_payments(db, member_id=member_id)


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse
)
def get_payment(
    payment_id: UUID,
    db: Session = Depends(get_db)
):

    payment = service.get_payment(
        db,
        payment_id
    )

    if payment is None:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return payment


@router.put(
    "/{payment_id}",
    response_model=PaymentResponse
)
def update_payment(
    payment_id: UUID,
    request: UpdatePaymentRequest,
    db: Session = Depends(get_db)
):

    payment = service.update_payment(
        db,
        payment_id,
        request
    )

    if payment is None:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return payment