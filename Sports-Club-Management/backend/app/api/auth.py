from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth_schema import LoginRequest, SignupRequest, LoginResponse, UserInToken
from app.services.auth_service import AuthService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

service = AuthService()


@router.post(
    "/signup",
    response_model=LoginResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):
    result = service.signup(db, request)

    if result is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return result


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    result = service.login(db, request.email, request.password)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result


@router.get("/me", response_model=UserInToken)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user