from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.technique import Technique
from app.models.technique_rating import TechniqueRating, Confidence

def get_ratings_for_user(db: Session, user_id: UUID) -> list[TechniqueRating]:
    stmt = select(TechniqueRating).where(TechniqueRating.user_id == user_id)
    return list(db.scalars(stmt).all())

def technique_exists(db: Session, technique_id: str) -> bool:
    stmt = select(Technique.id).where(Technique.id == technique_id)
    return db.scalar(stmt).first() is not None

def upsert_rating(
        db: Session,
        user_id: UUID,
        technique_id: str,
        rating: int,
        confidence: Confidence,
) -> TechniqueRating:
    existing = db.get(TechniqueRating, (user_id, technique_id))

    if existing is not None:
        existing.rating = rating
        existing.confidence = confidence
        db.commit()
        db.refresh(existing)
        return existing

    new_rating = TechniqueRating(
        user_id=user_id,
        technique_id=technique_id,
        rating=rating,
        confidence=confidence,
    )
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating

def delete_rating(db: Session, user_id: UUID, technique_id: str) -> bool:
    existing = db.get(TechniqueRating, (user_id, technique_id))
    if existing is None:
        return False
    db.delete(existing)
    db.commit()
    return True