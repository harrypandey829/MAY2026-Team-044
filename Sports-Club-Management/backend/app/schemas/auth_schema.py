from pydantic import BaseModel
from pydantic import EmailStr


class SignupRequest(BaseModel):

    first_name: str

    last_name: str

    email: EmailStr

    phone: str | None = None

    password: str

class LoginRequest(BaseModel):

    email: EmailStr

    password: str