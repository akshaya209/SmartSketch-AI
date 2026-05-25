import React from "react";
import "./DrawingCanvas.css";

/**
 * DrawingCanvas
 * Renders the HTML5 canvas and wires up mouse + touch events.
 * All drawing logic lives in the useDrawing hook passed via props.
 */
function DrawingCanvas({ canvasRef, onStart, onDraw, onStop }) {
  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="drawing-canvas"
        /* Mouse events */
        onMouseDown={onStart}
        onMouseMove={onDraw}
        onMouseUp={onStop}
        onMouseLeave={onStop}
        /* Touch events */
        onTouchStart={onStart}
        onTouchMove={onDraw}
        onTouchEnd={onStop}
        aria-label="Drawing canvas — draw a digit here"
      />
      <div className="canvas-grid" aria-hidden="true" />
    </div>
  );
}

export default DrawingCanvas;
