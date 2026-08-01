from pydantic import BaseModel
from pydantic import EmailStr
from uuid import UUID

from app.common.enums import UserRole


class UserResponse(BaseModel):

    id: UUID

    first_name: str

    last_name: str

    email: EmailStr

    phone: str | None

    role: UserRole

    profile_picture_url: str | None

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):

    first_name: str

    last_name: str

    phone: str | None = None

    profile_picture_url: str | None = None


class PasswordResetRequest(BaseModel):

    email: EmailStr

    old_password: str

    new_password: str