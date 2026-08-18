import enum
from datetime import date, datetime
from typing import List

from sqlalchemy import (
    Text,
    SmallInteger,
    Date,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Enum,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base import Base


class SessionType(str, enum.Enum):
    GI = "gi"
    NO_GI = "no-gi"


class TrainingSession(Base):
    __tablename__ = "sessions"
    __table_args__ = (
        CheckConstraint(
            "duration_mins > 0",
            name="ck_session_duration_positive",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    date: Mapped[date] = mapped_column(Date, nullable=False)
    type: Mapped[SessionType] = mapped_column(
        Enum(
            SessionType,
            name="session_type",
            values_callable=lambda e: [member.value for member in e],
        ),
        nullable=False,
    )
    duration_mins: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    techniques: Mapped[List["SessionTechnique"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return (
            f"<TrainingSession(id={self.id}, user_id={self.user_id}, "
            f"date={self.date}, type={self.type})>"
        )