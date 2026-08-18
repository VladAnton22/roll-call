from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.training_session import TrainingSession
from app.models.session_technique import SessionTechnique
from app.models.technique import Technique
from app.schemas.session_schemas import SessionCreate

def get_missing_technique_ids(db: Session, technique_ids: list) -> list[str]:
    if not technique_ids:
        return []
    stmt = select(Technique.id).where(Technique.id.in_(technique_ids))
    existing = set(db.scalars(stmt).all())
    return [tid for tid in technique_ids if tid not in existing]

def get_sessions_for_user(db: Session, user_id: UUID) -> list[TrainingSession]:
    stmt = (
        select(TrainingSession)
        .where(TrainingSession.user_id == user_id)
        .options(selectinload(TrainingSession.techniques))
        .order_by(TrainingSession.created_at.desc())
    )
    return list(db.scalars(stmt).all())

def get_session(
        db: Session, *, user_id: UUID, session_id: UUID
) -> TrainingSession | None:
    stmt = (
        select(TrainingSession)
        .where(
            TrainingSession.id == session_id,
            TrainingSession.user_id == user_id,
        )
        .options(selectinload(TrainingSession.techniques))
    )
    return db.scalars(stmt).first()

def create_session(
        db: Session, *, user_id: UUID, data: SessionCreate
) -> TrainingSession:
    session = TrainingSession(
        user_id = user_id,
        date=data.date,
        type=data.type,
        duration_mins=data.duration_mins,
        notes=data.notes,
        techniques=[
            SessionTechnique(technique_id=tid) for tid in data.technique_ids
        ]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def update_session(
        db: Session, *, user_id: UUID, session_id, data: SessionCreate
) -> TrainingSession | None:
    session = get_session(db, user_id=user_id, session_id=session_id)
    if session is None:
        return None

    session.date = data.date
    session.type = data.type
    session.duration_mins = data.duration_mins
    session.notes = data.notes
    session.techniques = [
        SessionTechnique(technique_id=tid) for tid in data.technique_ids
    ]
    db.commit()
    db.refresh(session)
    return session

def delete_session(db: Session, *, user_id: UUID, session_id: UUID) -> bool:
    session = get_session(db, user_id=user_id, session_id=session_id)
    if session is None:
        return False
    db.delete(session)
    db.commit()
    return True