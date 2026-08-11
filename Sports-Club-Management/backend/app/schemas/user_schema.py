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

    sport: str | None = None

    address: str | None = None

    gender: str | None = None

    dob: str | None = None

    emergency_contact: str | None = None

    is_approved: bool = False

    status: str = "Pending"

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):

    first_name: str | None = None

    last_name: str | None = None

    phone: str | None = None

    profile_picture_url: str | None = None

    sport: str | None = None

    address: str | None = None

    gender: str | None = None

    dob: str | None = None

    emergency_contact: str | None = None

    is_approved: bool | None = None

    status: str | None = None




class PasswordResetRequest(BaseModel):

    email: EmailStr

    old_password: str

    new_password: str