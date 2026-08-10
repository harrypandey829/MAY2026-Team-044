from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.common.enums import UserRole
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.models.user import User
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth_schema import SignupRequest, LoginResponse, UserInToken


class AuthService:

    def __init__(self):
        self.repository = AuthRepository()

    def signup(self, db: Session, request: SignupRequest) -> LoginResponse | None:

        existing = self.repository.get_user_by_email(db, request.email)

        if existing:
            return None

        role = request.role if request.role else UserRole.MEMBER
        is_approved = True if role != UserRole.COACH else False
        user_status = "Active" if role != UserRole.COACH else "Pending"

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=hash_password(request.password),
            role=role,
            sport=request.sport,
            is_approved=is_approved,
            status=user_status
        )

        created_user = self.repository.create_user(db, user)

        token = create_access_token({"sub": str(created_user.id)})

        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user=UserInToken.model_validate(created_user)
        )

    def login(self, db: Session, email: str, password: str) -> LoginResponse | None:

        user = self.repository.get_user_by_email(db, email)

        if user is None:
            return None

        if not verify_password(password, user.password_hash):
            return None

        if user.status == "Suspended":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been suspended by an administrator."
            )

        if user.role == UserRole.COACH and not user.is_approved:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your coach registration is pending admin approval."
            )

        token = create_access_token({"sub": str(user.id)})

        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user=UserInToken.model_validate(user)
        )