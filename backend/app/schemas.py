from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Incoming request body: base64-encoded image."""

    image: str = Field(
        ...,
        description="Base64-encoded PNG image of the drawn digit (data-URI or raw base64).",
    )


class PredictResponse(BaseModel):
    """Prediction result returned to the frontend."""

    digit: int = Field(..., ge=0, le=9, description="Predicted digit (0-9).")
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Model confidence in [0, 1]."
    )
