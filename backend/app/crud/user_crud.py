from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID

from app.models.user import User

def get_by_username(db: Session, username: str) -> User | None:
    stmt = select(User).where(User.username == username)
    return db.scalars(stmt).first()

def get_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first()

def get_by_id(db: Session, user_id: UUID) -> User | None:
    stmt = select(User).where(User.id == user_id)
    return db.scalars(stmt).first()

def exists_by_username(db: Session, username: str) -> bool:
    stmt = select(User).where(User.username == username)
    return db.scalars(stmt).first() is not None

def exists_by_email(db: Session, email: str) -> bool:
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first() is not None

def create_user(
        db: Session,
        *,
        username: str,
        email: str,
        password_hash: str,
) -> User:
    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        disabled=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def disable_user(db: Session, user_id: UUID) -> User | None:
    user = get_by_id(db, user_id)
    if user:
        user.disabled = True
        db.commit()
        db.refresh(user)
    return user