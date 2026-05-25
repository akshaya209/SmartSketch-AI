"""
train.py — Train the DigitNet model on MNIST and save weights to mnist.pth
Run from the backend/ directory:
    python train.py
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------


class DigitNet(nn.Module):
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


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

tf = transforms.ToTensor()

train_loader = DataLoader(
    datasets.MNIST(".", train=True, download=True, transform=tf),
    batch_size=64,
    shuffle=True,
)

test_loader = DataLoader(
    datasets.MNIST(".", train=False, download=True, transform=tf),
    batch_size=64,
)

# ---------------------------------------------------------------------------
# Training loop
# ---------------------------------------------------------------------------

EPOCHS = 5

model = DigitNet()
optimizer = optim.Adam(model.parameters())
loss_fn = nn.CrossEntropyLoss()

print(f"Training DigitNet for {EPOCHS} epochs …\n")

for epoch in range(EPOCHS):
    model.train()
    for imgs, labels in train_loader:
        optimizer.zero_grad()
        loss_fn(model(imgs), labels).backward()
        optimizer.step()
    print(f"  Epoch {epoch + 1}/{EPOCHS} done")

# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------

model.eval()
correct = sum(
    (model(imgs).argmax(1) == labels).sum().item() for imgs, labels in test_loader
)
total = len(test_loader.dataset)
print(f"\nTest accuracy: {correct / total * 100:.2f}%  ({correct}/{total})")

# ---------------------------------------------------------------------------
# Save
# ---------------------------------------------------------------------------

torch.save(model.state_dict(), "mnist.pth")
print("Weights saved to mnist.pth")
