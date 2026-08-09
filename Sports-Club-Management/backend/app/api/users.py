from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user_schema import (
    UserResponse,
    UpdateProfileRequest,
    PasswordResetRequest
)
from app.services.user_services import UserService
from app.common.enums import UserRole

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

service = UserService()



@router.get(
    "/role/{role}",
    response_model=list[UserResponse]
)
def get_users_by_role(
    role: UserRole,
    db: Session = Depends(get_db)
):
    return service.get_users_by_role(db, role)


@router.get(
    "",
    response_model=list[UserResponse]
)
def get_all_users(
    db: Session = Depends(get_db)
):
    return service.get_all_users(db)


@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user_by_id(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    user = service.get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def update_profile(
    user_id: UUID,
    request: UpdateProfileRequest,
    db: Session = Depends(get_db)
):
    user = service.update_profile(db, user_id, request)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete users"
        )

    result = service.delete_user(db, current_user.id, user_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )



@router.post("/reset-password")
def reset_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    result = service.reset_password(db, request)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    return {"message": "Password updated successfully"}