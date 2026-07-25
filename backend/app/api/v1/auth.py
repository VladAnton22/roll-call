from typing import Annotated
from uuid import UUID

from fastapi import Depends, APIRouter, HTTPException, Response, Cookie, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token, create_refresh_token, verify_token, get_password_hash
from app.core.cookies import REFRESH_COOKIE_NAME, set_refresh_cookie, clear_refresh_cookie
from app.schemas.user_schemas import UserResponse
from app.schemas.auth_schema import TokenResponse, RegisterRequest
from app.crud import user_crud
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

def _issue_tokens(response: Response, user_id: str) -> TokenResponse:
    set_refresh_cookie(response, create_refresh_token(subject=user_id))
    return TokenResponse(
        access_token=create_access_token(subject=user_id),
        token_type="bearer",
    )

@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
        response: Response,
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Session = Depends(get_db),
):
    user = user_crud.get_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user")

    return _issue_tokens(response, str(user.id))

@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(
        payload: RegisterRequest,
        db: Annotated[Session, Depends(get_db)],
):
    if user_crud.exists_by_username(db, username=payload.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists",
        )

    if user_crud.exists_by_email(db, email=payload.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = user_crud.create_user(
        db,
        username=payload.username,
        email=payload.email,
        password_hash = get_password_hash(payload.password)
    )

    return user

@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(
        response: Response,
        db: Annotated[Session, Depends(get_db)],
        refresh_token: Annotated[str | None, Cookie(alias=REFRESH_COOKIE_NAME)] = None,
):
    invalid_token = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if refresh_token is None:
        raise invalid_token

    payload = verify_token(refresh_token, token_type="refresh")
    if not payload:
        raise invalid_token

    user_id = payload.get("sub")
    if not user_id:
        raise invalid_token

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise invalid_token

    user = user_crud.get_by_id(db, user_id=user_uuid)
    if user is None or user.disabled:
        raise invalid_token

    return _issue_tokens(response, str(user.id))

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout():
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    clear_refresh_cookie(response)
    return response
