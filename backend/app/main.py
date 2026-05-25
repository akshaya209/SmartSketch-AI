"""
MNIST Digit Recognition — FastAPI Backend
==========================================
Endpoints
---------
GET  /          → health check
POST /predict   → receive base64 image, return digit + confidence
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.model import load_model
from app.predict import predict_from_base64
from app.schemas import PredictRequest, PredictResponse
from app.utils import logger, resolve_model_path

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="MNIST Digit Recogniser API",
    description="Predict handwritten digits using a trained PyTorch model.",
    version="1.0.0",
)

# Allow requests from the React dev server and any production origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Model loading (once at startup)
# ---------------------------------------------------------------------------

model = None  # populated in the startup event


@app.on_event("startup")
async def startup_event():
    global model
    try:
        weights = resolve_model_path("mnist.pth")
        model = load_model(weights)
        logger.info("Model loaded successfully from %s", weights)
    except FileNotFoundError as exc:
        logger.error(str(exc))
        # App continues running but /predict will return 503


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "model_ready": model is not None}


@app.post("/predict", response_model=PredictResponse, tags=["inference"])
async def predict(body: PredictRequest):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run train.py to generate mnist.pth first.",
        )

    try:
        digit, confidence = predict_from_base64(model, body.image)
    except Exception as exc:
        logger.exception("Prediction failed: %s", exc)
        raise HTTPException(status_code=422, detail=f"Could not process image: {exc}")

    logger.info("Prediction → digit=%d  confidence=%.3f", digit, confidence)
    return PredictResponse(digit=digit, confidence=confidence)
