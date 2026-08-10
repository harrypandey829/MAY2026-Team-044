from pydantic import BaseModel
from pydantic import EmailStr
from typing import Optional
from uuid import UUID

from app.common.enums import UserRole


class SignupRequest(BaseModel):

    first_name: str

    last_name: str

    email: EmailStr

    phone: Optional[str] = None

    password: str

    role: Optional[UserRole] = UserRole.MEMBER

    sport: Optional[str] = None


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


class UserInToken(BaseModel):

    id: UUID

    first_name: str

    last_name: str

    email: EmailStr

    phone: Optional[str] = None

    role: UserRole

    profile_picture_url: Optional[str] = None

    sport: Optional[str] = None

    is_approved: bool = True

    status: str = "Active"

    class Config:
        from_attributes = True



class LoginResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"

    user: UserInToken