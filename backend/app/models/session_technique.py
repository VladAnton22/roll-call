import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class SessionTechnique(Base):
    __tablename__ = "session_techniques"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        primary_key=True,
    )
    technique_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("techniques.id", ondelete="RESTRICT"),
        primary_key=True,
    )

    session: Mapped["TrainingSession"] = relationship(back_populates="techniques")

    def __repr__(self) -> str:
        return (
            f"<SessionTechnique(session_id={self.session_id}, "
            f"technique_id={self.technique_id})>"
        )