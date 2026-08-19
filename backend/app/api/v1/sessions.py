from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.session_schemas import SessionCreate, SessionResponse
from app.crud import session_crud

router = APIRouter(prefix="/sessions", tags=["sessions"])

def _ensure_techniques_exist(db: Session, technique_ids: list[str]) -> None:
    missing = session_crud.get_missing_technique_ids(db, technique_ids)
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown technique ids: {','.join(missing)}",
        )


@router.get("", response_model=list[SessionResponse])
def list_sessions(
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    return session_crud.get_sessions_for_user(db, user_id=current_user.id)


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
        payload: SessionCreate,
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    _ensure_techniques_exist(db, payload.technique_ids)
    return session_crud.create_session(db, user_id=current_user.id, data=payload)


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(
    session_id: UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[Session, Depends(get_db)],
):
    session = session_crud.get_session(
        db, user_id=current_user.id, session_id=session_id
    )
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session

@router.put("/{session_id}", response_model=SessionResponse)
def update_session(
        session_id: UUID,
        payload: SessionCreate,
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    _ensure_techniques_exist(db, payload.technique_ids)
    session = session_crud.update_session(db, user_id=current_user.id, session_id=session_id, data=payload)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
        session_id: UUID,
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    deleted = session_crud.delete_session(db, user_id=current_user.id, session_id=session_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return None