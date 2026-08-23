from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreateResourceRequest(BaseModel):
    name: str
    resource_type: str = "Facility"
    quantity: int = 1
    capacity: int = 50

class UpdateResourceRequest(BaseModel):
    name: str
    resource_type: str
    quantity: int
    capacity: int = 50
    is_available: bool

class ResourceResponse(BaseModel):
    id: UUID
    name: str
    resource_type: str | None = None
    quantity: int = 1
    capacity: int | None = 50
    is_available: bool = True
    created_at: datetime

    class Config:
        from_attributes = True