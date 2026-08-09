from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    def get_user_by_id(
        self,
        db: Session,
        user_id
    ) -> User | None:

        from uuid import UUID as PyUUID
        if isinstance(user_id, str):
            try:
                user_id = PyUUID(user_id)
            except ValueError:
                pass

        stmt = (
            select(User)
            .where(User.id == user_id)
        )

        result = db.execute(stmt)

        return result.scalar_one_or_none()

    def get_by_id(
        self,
        db: Session,
        user_id
    ) -> User | None:
        return self.get_user_by_id(db, user_id)

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