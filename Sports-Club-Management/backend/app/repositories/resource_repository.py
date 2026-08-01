from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource import Resource


class ResourceRepository:

    def create(
        self,
        db: Session,
        resource: Resource
    ):

        db.add(resource)

        db.commit()

        db.refresh(resource)

        return resource

    def get_all(
        self,
        db: Session
    ):

        stmt = (
            select(Resource)
            .order_by(Resource.name)
        )

        result = db.execute(stmt)

        return result.scalars().all()

    def get_by_id(
        self,
        db: Session,
        resource_id: UUID
    ):

        stmt = (
            select(Resource)
            .where(Resource.id == resource_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def update(
        self,
        db: Session,
        resource: Resource
    ):

        db.commit()

        db.refresh(resource)

        return resource

    def delete(
        self,
        db: Session,
        resource: Resource
    ):

        db.delete(resource)

        db.commit()