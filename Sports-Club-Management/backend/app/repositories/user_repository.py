from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    def get_user_by_id(
        self,
        db: Session,
        user_id: str
    ) -> User | None:

        stmt = (
            select(User)
            .where(User.id == user_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_all_users(
        self,
        db: Session
    ) -> list[User]:

        stmt = select(User)

        result = db.execute(stmt)

        return result.scalars().all()

    def update_user(
        self,
        db: Session,
        user: User
    ) -> User:

        db.commit()

        db.refresh(user)

        return user

    def delete_user(
        self,
        db: Session,
        user: User
    ):

        db.delete(user)

        db.commit()