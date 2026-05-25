# SmartSketch-AI — Handwritten Digit Recognition

A full-stack web application for real-time handwritten digit recognition built with **React** + **FastAPI** + **PyTorch (MNIST)**.

Draw any digit (0-9) on the canvas, click **Predict**, and watch the neural network classify it with a confidence score.

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI app, CORS, startup
│   │   ├── model.py      # DigitNet architecture + loader
│   │   ├── predict.py    # Image decoding, preprocessing, inference
│   │   ├── schemas.py    # Pydantic request/response models
│   │   └── utils.py      # Logging, path helpers
│   ├── train.py          # Train DigitNet on MNIST → mnist.pth
│   ├── mnist.pth         # Saved weights (after training)
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DrawingCanvas.js   # HTML5 canvas with mouse+touch
│   │   │   ├── DrawingCanvas.css
│   │   │   ├── PredictionDisplay.js
│   │   │   └── PredictionDisplay.css
│   │   ├── hooks/
│   │   │   └── useDrawing.js      # All canvas drawing logic
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | ≥ 3.9 |
| Node.js | ≥ 18 |
| npm | ≥ 9 |

---

## Setup

### 1 — Backend

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2 — Train the model

> Skip this step if you already have `mnist.pth` in the `backend/` directory.

```bash
cd backend
python train.py
```

Expected output:
```
Training DigitNet for 5 epochs …
  Epoch 1/5 done
  ...
  Epoch 5/5 done

Test accuracy: 97.80%  (9780/10000)
Weights saved to mnist.pth
```

### 3 — Start the backend server

```bash
cd backend
uvicorn app.main:app --reload
```

The API is now available at **http://127.0.0.1:8000**

### 4 — Frontend

```bash
cd frontend
npm install
npm start
```

The React app opens at **http://localhost:3000**

---

## Usage

1. Open **http://localhost:3000** in your browser.
2. Draw a digit (0-9) on the black canvas with your mouse or finger.
3. Click **Predict** — the model returns the digit and confidence score.
4. Click **Clear** to reset and draw again.

---

## API Reference

### `GET /`

Health check.

**Response**
```json
{ "status": "ok", "model_ready": true }
```

---

### `POST /predict`

Predict the digit drawn on the canvas.

**Request body**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `image` | string | Base64-encoded PNG (data-URI or raw). Must be a drawing of a single digit. |

**Response**
```json
{
  "digit": 7,
  "confidence": 0.9823
}
```

| Field | Type | Description |
|-------|------|-------------|
| `digit` | integer (0-9) | Predicted digit class. |
| `confidence` | float (0-1) | Softmax probability for the top prediction. |

**Error responses**

| Status | Meaning |
|--------|---------|
| 422 | Image could not be decoded or is malformed. |
| 503 | Model weights not loaded (run `train.py` first). |

---

## Model Architecture

```
DigitNet
 └─ Sequential
     ├─ Flatten          (784)
     ├─ Linear 784→256   + ReLU
     ├─ Linear 256→128   + ReLU
     └─ Linear 128→10    (logits)
```

**Training**: Adam optimizer, CrossEntropyLoss, 5 epochs, batch size 64.  
**Accuracy**: ~97-98% on the MNIST test set.

**Preprocessing pipeline** (backend):
1. Decode base64 PNG → PIL Image
2. Convert to grayscale (`L` mode)
3. Resize to 28 × 28 with LANCZOS resampling
4. Normalise pixels to [0, 1]
5. Add batch + channel dimensions → tensor shape `(1, 1, 28, 28)`

---

## Screenshots

| Drawing canvas | Prediction result |
|----------------|-------------------|
| _(screenshot)_ | _(screenshot)_ |

---

## Development notes

- The React dev server proxies `/predict` → `http://127.0.0.1:8000` automatically (configured in `package.json`).
- Set `REACT_APP_API_URL` environment variable to override the backend URL in production builds.
- CORS is configured for `http://localhost:3000` and `http://127.0.0.1:3000`.
