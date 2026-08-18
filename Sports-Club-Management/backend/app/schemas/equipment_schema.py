from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class EquipmentCreate(BaseModel):
    sport_name: str
    name: str
    total_quantity: int = 1

class EquipmentResponse(BaseModel):
    id: UUID
    sport_name: str
    name: str
    total_quantity: int
    available_quantity: int
    created_at: datetime

    class Config:
        from_attributes = True

class EquipmentIssueRequest(BaseModel):
    equipment_id: UUID
    quantity: int = 1
    duration_hours: int = 1

class EquipmentIssuanceResponse(BaseModel):
    id: UUID
    member_id: UUID
    equipment_id: UUID
    sport_name: str
    quantity: int
    issued_at: datetime
    duration_hours: int
    expected_return_at: datetime
    returned_at: datetime | None = None
    status: str

    class Config:
        from_attributes = True
