from pydantic import BaseModel, Field, field_validator


class PredictionRequest(BaseModel):
    N: float = Field(ge=0, le=200)
    P: float = Field(ge=0, le=200)
    K: float = Field(ge=0, le=250)
    temperature: float = Field(ge=-10, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=1000)

    @field_validator("*")
    @classmethod
    def finite_number(cls, value: float) -> float:
        if value != value or value in (float("inf"), float("-inf")):
            raise ValueError("Value must be finite")
        return value


class CropScore(BaseModel):
    crop: str
    confidence: float


class PredictionResponse(BaseModel):
    recommended_crop: str
    confidence: float
    alternatives: list[CropScore]
    model: str
    warning: str
