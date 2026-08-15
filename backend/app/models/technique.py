from sqlalchemy import String, SmallInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Technique(Base):
    __tablename__ = "techniques"

    # Natural key: the slug used by the frontend ("armbar-guard")
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category_id: Mapped[str] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    position: Mapped[int] = mapped_column(SmallInteger, nullable=False, default=0)

    category: Mapped["Category"] = relationship(back_populates="techniques")

    def __repr__(self) -> str:
        return f"<Technique(id={self.id}, name={self.name})>"