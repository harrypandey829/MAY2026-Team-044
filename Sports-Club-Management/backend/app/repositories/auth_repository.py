from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class AuthRepository:

    def get_user_by_email(
        self,
        db: Session,
        email: str
    ) -> User | None:

        stmt = (
            select(User)
            .where(User.email == email)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def create_user(
        self,
        db: Session,
        user: User
    ) -> User:

        db.add(user)

        db.commit()

        db.refresh(user)

        return user