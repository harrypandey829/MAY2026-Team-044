from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.certificate_schema import CertificateCreate, CertificateResponse

router = APIRouter(
    prefix="/certificates",
    tags=["Member Certificates"]
)

@router.get("/member/{member_id}", response_model=List[CertificateResponse])
def get_member_certificates(
    member_id: UUID,
    db: Session = Depends(get_db)
):
    return db.query(Certificate).filter(Certificate.member_id == member_id).all()

@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def issue_certificate(
    payload: CertificateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cert = Certificate(
        member_id=payload.member_id,
        sport_name=payload.sport_name,
        title=payload.title,
        issued_by=payload.issued_by
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert
