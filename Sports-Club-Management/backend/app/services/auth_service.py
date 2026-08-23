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
        # All newly self-registered non-admin accounts start as unapproved pending admin review
        is_approved = False if role != UserRole.ADMIN else True
        user_status = "Pending" if role != UserRole.ADMIN else "Active"

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=hash_password(request.password),
            role=role,
            sport=request.sport,
            address=request.address,
            gender=request.gender,
            dob=request.dob,
            emergency_contact=request.emergency_contact,
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

        if not user.is_approved and user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account registration is pending admin approval before you can log in."
            )


        token = create_access_token({"sub": str(user.id)})

        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user=UserInToken.model_validate(user)
        )