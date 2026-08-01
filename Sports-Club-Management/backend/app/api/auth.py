from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi import status

from app.db.session import get_db
from app.schemas.auth_schema import LoginRequest
from app.schemas.auth_schema import SignupRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

service = AuthService()


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED
)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):

    user = service.signup(
        db,
        request
    )

    if user is None:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {

        "message": "User created successfully",

        "id": str(user.id),

        "email": user.email
    }


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = service.login(

        db,

        request.email,

        request.password
    )

    if user is None:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"
        )

    return {

        "message": "Login successful",

        "id": str(user.id),

        "email": user.email,

        "role": user.role
    }