from typing import List

from sqlalchemy import String, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Category(Base):
    __tablename__ = "categories"

    # Natural key: the slug used by the frontend (e.g. "submissions")
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[int] = mapped_column(SmallInteger, nullable=False, default=0)

    techniques: Mapped[List["Technique"]] = relationship(
        back_populates="category",
        order_by="Technique.position",
    )

    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name={self.name})>"