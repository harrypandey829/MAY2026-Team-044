from sqlalchemy.orm import Session

from app.common.enums import UserRole
from app.core.security import hash_password
from app.core.security import verify_password
from app.models.user import User
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth_schema import SignupRequest


class AuthService:

    def __init__(self):

        self.repository = AuthRepository()

    def signup(
        self,
        db: Session,
        request: SignupRequest
    ):

        existing = self.repository.get_user_by_email(
            db,
            request.email
        )

        if existing:

            return None

        user = User(

            first_name=request.first_name,

            last_name=request.last_name,

            email=request.email,

            phone=request.phone,

            password_hash=hash_password(
                request.password
            ),

            role=UserRole.MEMBER
        )

        return self.repository.create_user(
            db,
            user
        )

    def login(
        self,
        db: Session,
        email: str,
        password: str
    ):

        user = self.repository.get_user_by_email(
            db,
            email
        )

        if user is None:

            return None

        if not verify_password(
            password,
            user.password_hash
        ):

            return None

        return user