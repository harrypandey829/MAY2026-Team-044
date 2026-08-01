from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.resource_schema import (
    CreateResourceRequest,
    UpdateResourceRequest,
    ResourceResponse
)

from app.services.resource_service import ResourceService


router = APIRouter(

    prefix="/resources",

    tags=["Resources"]

)

service = ResourceService()


@router.post(
    "",
    response_model=ResourceResponse,
    status_code=201
)
def create_resource(
    request: CreateResourceRequest,
    db: Session = Depends(get_db)
):

    return service.create(
        db,
        request
    )


@router.get(
    "",
    response_model=list[ResourceResponse]
)
def get_resources(
    db: Session = Depends(get_db)
):

    return service.get_all(db)


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse
)
def get_resource(
    resource_id: UUID,
    db: Session = Depends(get_db)
):

    resource = service.get_by_id(
        db,
        resource_id
    )

    if resource is None:

        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return resource


@router.put(
    "/{resource_id}",
    response_model=ResourceResponse
)
def update_resource(
    resource_id: UUID,
    request: UpdateResourceRequest,
    db: Session = Depends(get_db)
):

    resource = service.update(
        db,
        resource_id,
        request
    )

    if resource is None:

        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return resource


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: UUID,
    db: Session = Depends(get_db)
):

    deleted = service.delete(
        db,
        resource_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return {

        "message": "Resource deleted successfully"
    }