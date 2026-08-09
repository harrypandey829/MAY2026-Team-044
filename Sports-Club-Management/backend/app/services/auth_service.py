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

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=hash_password(request.password),
            role=role,
            sport=request.sport
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

        token = create_access_token({"sub": str(user.id)})

        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user=UserInToken.model_validate(user)
        )