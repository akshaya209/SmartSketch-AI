import React, { useState, useCallback } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import PredictionDisplay from "./components/PredictionDisplay";
import { useDrawing } from "./hooks/useDrawing";
import { predictDigit } from "./services/api";
import "./App.css";

function App() {
  const { canvasRef, isEmpty, startDrawing, draw, stopDrawing, clearCanvas, getDataURL } =
    useDrawing();

  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = useCallback(async () => {
    if (isEmpty) return;
    setLoading(true);
    setError(null);

    try {
      const dataUrl = getDataURL();
      const result = await predictDigit(dataUrl);
      setPrediction(result.digit);
      setConfidence(result.confidence);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Could not reach the backend.";
      setError(msg);
      setPrediction(null);
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  }, [isEmpty, getDataURL]);

  const handleClear = useCallback(() => {
    clearCanvas();
    setPrediction(null);
    setConfidence(null);
    setError(null);
  }, [clearCanvas]);

  return (
    <div className="app">
      {/* Background noise texture */}
      <div className="bg-noise" aria-hidden="true" />

      {/* Header */}
      <header className="app-header">
        <div className="header-tag">NEURAL NETWORK DEMO</div>
        <h1 className="app-title">
          Digit<span className="title-accent">Net</span>
        </h1>
        <p className="app-subtitle">
          Handwritten digit recognition · MNIST · PyTorch
        </p>
      </header>

      {/* Main card */}
      <main className="app-main">
        <div className="card">
          {/* Canvas side */}
          <section className="canvas-section">
            <div className="section-label">INPUT</div>
            <DrawingCanvas
              canvasRef={canvasRef}
              onStart={startDrawing}
              onDraw={draw}
              onStop={stopDrawing}
            />
            <p className="hint">
              {isEmpty ? "Draw any digit (0-9)" : "Looking good — hit Predict!"}
            </p>

            {/* Actions */}
            <div className="button-row">
              <button
                className="btn btn-ghost"
                onClick={handleClear}
                disabled={isEmpty && prediction === null}
                aria-label="Clear canvas"
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePredict}
                disabled={isEmpty || loading}
                aria-label="Predict digit"
              >
                {loading ? "Predicting…" : "Predict"}
              </button>
            </div>
          </section>

          {/* Divider */}
          <div className="card-divider" aria-hidden="true">
            <div className="divider-arrow">›</div>
          </div>

          {/* Result side */}
          <section className="result-section">
            <div className="section-label">OUTPUT</div>
            <PredictionDisplay
              prediction={prediction}
              confidence={confidence}
              loading={loading}
              error={error}
            />
          </section>
        </div>

        {/* Footer info */}
        <footer className="app-footer">
          <span>Model: DigitNet · 5 epochs · ~98% MNIST accuracy</span>
          <span className="footer-sep">·</span>
          <span>Backend: FastAPI @ 127.0.0.1:8000</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
