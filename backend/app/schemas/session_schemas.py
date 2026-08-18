from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.training_session import SessionType


class SessionCreate(BaseModel):
    date: date
    type: SessionType
    duration_mins: int = Field(gt=0, le=1440)
    notes: str = Field(default="", max_length=2000)
    technique_ids: list[str] = Field(default_factory=list)

    @field_validator("technique_ids")
    @classmethod
    def dedupe_technique_ids(cls, value: list[str]) -> list[str]:
        seen: set[str] = set()
        unique: list[str] = []
        for technique_id in value:
            if technique_id not in seen:
                seen.add(technique_id)
                unique.append(technique_id)
        return unique


class SessionResponse(BaseModel):
    id: UUID
    date: date
    type: SessionType
    duration_mins: int
    notes: str
    technique_ids: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)