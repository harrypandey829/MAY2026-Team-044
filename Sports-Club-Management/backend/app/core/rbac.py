from typing import List
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import User
from app.common.enums import UserRole

def require_roles(allowed_roles: List[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for your user role"
            )
        return current_user
    return role_checker
