from uuid import UUID
from typing import Annotated

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jwt.exceptions import InvalidTokenError

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.crud import user_crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Annotated[Session, Depends(get_db)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)

        if payload.get("type") != "access":
            raise credentials_exception

        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        user_uuid = UUID(user_id)
    except (InvalidTokenError, ValueError):
        raise credentials_exception

    user = user_crud.get_by_id(db, user_uuid)

    if user is None:
        raise credentials_exception

    return user

def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    return current_user
