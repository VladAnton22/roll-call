import enum
import uuid
from datetime import datetime
from sqlalchemy import (
    String,
    SmallInteger,
    ForeignKey,
    DateTime,
    func,
    CheckConstraint,
    Enum,
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Confidence(str, enum.Enum):
    LOW = "L"
    MEDIUM = "M"
    HIGH = "H"

class TechniqueRating(Base):
    __tablename__ = "technique_ratings"
    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name = "ck_technique_rating_rating_range",
        ),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    technique_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("techniques.id", ondelete="RESTRICT"),
        primary_key=True,
    )

    rating: Mapped[int] = mapped_column(SmallInteger(), nullable=False)
    confidence: Mapped[Confidence] = mapped_column(
        Enum(
            Confidence,
            name="confidence",
            values_callable=lambda e: [member.value for member in e],
        ),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return (
            f"<TechniqueRating(user_id={self.user_id}, "
            f"technique_id={self.technique_id}, rating={self.rating})>"
        )