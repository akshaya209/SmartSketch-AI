import React from "react";
import "./PredictionDisplay.css";

/**
 * PredictionDisplay
 * Shows the predicted digit, confidence bar, and loading/error states.
 */
function PredictionDisplay({ prediction, confidence, loading, error }) {
  const pct = confidence !== null ? Math.round(confidence * 100) : 0;

  // Colour shifts from red → amber → green as confidence rises
  const barColor =
    pct < 50 ? "#ff4444" : pct < 75 ? "var(--accent)" : "#4cff91";

  return (
    <div className="prediction-panel">
      {/* Main digit display */}
      <div className={`digit-display ${loading ? "pulsing" : ""}`}>
        {loading ? (
          <span className="spinner" aria-label="Loading" />
        ) : error ? (
          <span className="digit-error">!</span>
        ) : prediction !== null ? (
          <span className="digit-value" key={prediction}>
            {prediction}
          </span>
        ) : (
          <span className="digit-placeholder">?</span>
        )}
      </div>

      {/* Label */}
      <p className="prediction-label">
        {loading
          ? "Analysing…"
          : error
          ? "Error"
          : prediction !== null
          ? "Predicted Digit"
          : "Draw to predict"}
      </p>

      {/* Confidence bar */}
      <div className="confidence-section" aria-hidden={prediction === null}>
        <div className="confidence-header">
          <span className="confidence-title">Confidence</span>
          <span className="confidence-pct" style={{ color: barColor }}>
            {prediction !== null && !loading && !error ? `${pct}%` : "—"}
          </span>
        </div>
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{
              width: prediction !== null && !loading ? `${pct}%` : "0%",
              background: barColor,
            }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default PredictionDisplay;
