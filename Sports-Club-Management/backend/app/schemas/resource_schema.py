from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class CreateResourceRequest(BaseModel):

    name: str

    resource_type: str

    quantity: int


class UpdateResourceRequest(BaseModel):

    name: str

    resource_type: str

    quantity: int

    is_available: bool


class ResourceResponse(BaseModel):

    id: UUID

    name: str

    resource_type: str

    quantity: int

    is_available: bool

    created_at: datetime

    class Config:

        from_attributes = True