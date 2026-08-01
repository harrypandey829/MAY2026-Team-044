from uuid import UUID

from sqlalchemy.orm import Session

from app.common.enums import UserRole
from app.core.security import hash_password
from app.core.security import verify_password
from app.repositories.auth_repository import AuthRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import (
    UpdateProfileRequest,
    PasswordResetRequest,
)


class UserService:

    def __init__(self):

        self.user_repository = UserRepository()

        self.auth_repository = AuthRepository()

    def get_user_by_id(
        self,
        db: Session,
        user_id: UUID
    ):

        return self.user_repository.get_user_by_id(
            db,
            user_id
        )

    def get_all_users(
        self,
        db: Session
    ):

        return self.user_repository.get_all_users(
            db
        )

    def update_profile(
        self,
        db: Session,
        user_id: UUID,
        request: UpdateProfileRequest
    ):

        user = self.user_repository.get_user_by_id(
            db,
            user_id
        )

        if user is None:

            return None

        user.first_name = request.first_name

        user.last_name = request.last_name

        user.phone = request.phone

        user.profile_picture_url = (
            request.profile_picture_url
        )

        return self.user_repository.update_user(
            db,
            user
        )

    def delete_user(
        self,
        db: Session,
        admin_id: UUID,
        user_id: UUID
    ):

        admin = self.user_repository.get_user_by_id(
            db,
            admin_id
        )

        if admin is None:

            return None

        if admin.role != UserRole.ADMIN:

            return "NOT_ADMIN"

        user = self.user_repository.get_user_by_id(
            db,
            user_id
        )

        if user is None:

            return None

        self.user_repository.delete_user(
            db,
            user
        )

        return True

    def reset_password(
        self,
        db: Session,
        request: PasswordResetRequest
    ):

        user = self.auth_repository.get_user_by_email(
            db,
            request.email
        )

        if user is None:

            return None

        if not verify_password(
            request.old_password,
            user.password_hash
        ):

            return False

        user.password_hash = hash_password(
            request.new_password
        )

        return self.user_repository.update_user(
            db,
            user
        )