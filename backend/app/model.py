import torch
import torch.nn as nn


class DigitNet(nn.Module):
    """
    Simple feedforward neural network for MNIST digit classification.
    Architecture: Flatten → Linear(784→256) → ReLU → Linear(256→128) → ReLU → Linear(128→10)
    """

    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.net(x)


def load_model(weights_path: str = "mnist.pth") -> DigitNet:
    """Load the trained model from disk."""
    model = DigitNet()
    model.load_state_dict(torch.load(weights_path, map_location="cpu"))
    model.eval()
    return model
