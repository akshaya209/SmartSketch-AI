import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("mnist-api")


def resolve_model_path(filename: str = "mnist.pth") -> str:
    """
    Resolve the absolute path to the model weights file.
    Looks in the backend directory (one level above app/).
    """
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base, filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(
            f"Model weights not found at '{path}'. "
            "Run `python train.py` inside the backend/ directory first."
        )
    return path
