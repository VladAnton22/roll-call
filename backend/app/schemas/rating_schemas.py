from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.technique_rating import Confidence


class RatingUpsert(BaseModel):
    rating: int = Field(ge=1, le=5)
    confidence: Confidence


class RatingResponse(BaseModel):
    technique_id: str
    rating: int
    confidence: Confidence
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)