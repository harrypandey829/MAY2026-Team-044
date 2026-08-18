from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class CertificateCreate(BaseModel):
    member_id: UUID
    sport_name: str
    title: str
    issued_by: str

class CertificateResponse(BaseModel):
    id: UUID
    member_id: UUID
    sport_name: str
    title: str
    issued_by: str
    issued_date: datetime

    class Config:
        from_attributes = True
