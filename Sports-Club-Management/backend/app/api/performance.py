from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.performance_schema import (
    CreatePerformanceRequest,
    UpdatePerformanceRequest,
    PerformanceResponse
)
from app.services.performance_service import PerformanceService

router = APIRouter(
    prefix="/performance",
    tags=["Performance"]
)

service = PerformanceService()


@router.post(
    "",
    response_model=PerformanceResponse,
    status_code=201
)
def create_performance(
    request: CreatePerformanceRequest,
    db: Session = Depends(get_db)
):

    return service.create_performance(
        db,
        request
    )


@router.get(
    "/{performance_id}",
    response_model=PerformanceResponse
)
def get_performance(
    performance_id: UUID,
    db: Session = Depends(get_db)
):

    performance = service.get_performance(
        db,
        performance_id
    )

    if performance is None:

        raise HTTPException(
            status_code=404,
            detail="Performance not found"
        )

    return performance


@router.get(
    "/member/{member_id}",
    response_model=list[PerformanceResponse]
)
def member_history(
    member_id: UUID,
    db: Session = Depends(get_db)
):

    return service.get_member_history(
        db,
        member_id
    )


@router.put(
    "/{performance_id}",
    response_model=PerformanceResponse
)
def update_performance(
    performance_id: UUID,
    request: UpdatePerformanceRequest,
    db: Session = Depends(get_db)
):

    performance = service.update_performance(
        db,
        performance_id,
        request
    )

    if performance is None:

        raise HTTPException(
            status_code=404,
            detail="Performance not found"
        )

    return performance


@router.delete(
    "/{performance_id}"
)
def delete_performance(
    performance_id: UUID,
    db: Session = Depends(get_db)
):

    deleted = service.delete_performance(
        db,
        performance_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Performance not found"
        )

    return {
        "message": "Performance deleted successfully"
    }