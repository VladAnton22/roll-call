from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.rating_schemas import RatingUpsert, RatingResponse
from app.crud import rating_crud

router = APIRouter(prefix="/ratings", tags=["ratings"])

@router.get("", response_model=list[RatingResponse])
def list_ratings(
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    return rating_crud.get_ratings_for_user(db, user_id=current_user.id)

@router.put("/{technique_id}", response_model=RatingResponse)
def upsert_rating(
        technique_id: str,
        payload: RatingUpsert,
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    if not rating_crud.technique_exists(db, technique_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technique not found",
        )
    return rating_crud.upsert_rating(
        db,
        user_id=current_user.id,
        technique_id=technique_id,
        rating=payload.rating,
        confidence=payload.confidence,
    )

@router.delete("/{technique_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(
        technique_id: str,
        current_user: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
):
    deleted = rating_crud.delete_rating(
        db, user_id=current_user.id, technique_id=technique_id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technique not found",
        )
    return None