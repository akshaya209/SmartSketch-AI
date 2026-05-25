import base64
import io
from typing import Tuple

import numpy as np
import torch
from PIL import Image

from app.model import DigitNet


def decode_image(image_data: str) -> Image.Image:
    """
    Decode a base64-encoded PNG/JPEG string into a PIL Image.
    Accepts both raw base64 and data-URI format (data:image/png;base64,...).
    """
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    raw = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(raw)).convert("L")  # grayscale
    return img


def preprocess(img: Image.Image) -> torch.Tensor:
    """
    Resize image to 28×28 and normalise pixel values to [0, 1].
    Returns a float32 tensor of shape (1, 1, 28, 28).
    """
    small = img.resize((28, 28), Image.LANCZOS)
    arr = np.array(small) / 255.0
    tensor = torch.tensor(arr, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
    return tensor


def run_prediction(model: DigitNet, tensor: torch.Tensor) -> Tuple[int, float]:
    """Run inference and return (digit, confidence) tuple."""
    with torch.no_grad():
        out = model(tensor)
        digit = out.argmax().item()
        conf = torch.softmax(out, dim=1).max().item()
    return int(digit), float(conf)


def predict_from_base64(model: DigitNet, image_data: str) -> Tuple[int, float]:
    """End-to-end helper: base64 string → (digit, confidence)."""
    img = decode_image(image_data)
    tensor = preprocess(img)
    return run_prediction(model, tensor)
