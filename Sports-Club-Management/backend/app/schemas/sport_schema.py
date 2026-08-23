from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class SportCreate(BaseModel):
    name: str
    monthly_fee: float = 0.0
    annual_fee: float = 0.0
    description: str | None = None

class SportResponse(BaseModel):
    id: UUID
    name: str
    monthly_fee: float
    annual_fee: float
    description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
