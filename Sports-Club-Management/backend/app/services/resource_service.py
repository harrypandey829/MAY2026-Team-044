from uuid import UUID

from sqlalchemy.orm import Session

from app.models.resource import Resource

from app.repositories.resource_repository import ResourceRepository

from app.schemas.resource_schema import (
    CreateResourceRequest,
    UpdateResourceRequest
)


class ResourceService:

    def __init__(self):

        self.repository = ResourceRepository()

    def create(
        self,
        db: Session,
        request: CreateResourceRequest
    ):

        resource = Resource(

            name=request.name,

            resource_type=request.resource_type,

            quantity=request.quantity,

            is_available=True
        )

        return self.repository.create(
            db,
            resource
        )

    def get_all(
        self,
        db: Session
    ):

        return self.repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        resource_id: UUID
    ):

        return self.repository.get_by_id(
            db,
            resource_id
        )

    def update(
        self,
        db: Session,
        resource_id: UUID,
        request: UpdateResourceRequest
    ):

        resource = self.repository.get_by_id(
            db,
            resource_id
        )

        if resource is None:

            return None

        resource.name = request.name

        resource.resource_type = request.resource_type

        resource.quantity = request.quantity

        resource.is_available = request.is_available

        return self.repository.update(
            db,
            resource
        )

    def delete(
        self,
        db: Session,
        resource_id: UUID
    ):

        resource = self.repository.get_by_id(
            db,
            resource_id
        )

        if resource is None:

            return False

        self.repository.delete(
            db,
            resource
        )

        return True