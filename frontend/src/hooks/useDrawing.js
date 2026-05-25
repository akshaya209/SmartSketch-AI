import { useRef, useCallback, useEffect, useState } from "react";

/**
 * useDrawing — manages all canvas drawing state and events.
 * Returns refs + helpers consumed by DrawingCanvas.
 */
export function useDrawing() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Resolve pointer position relative to canvas (handles touch + mouse)
  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      isDrawing.current = true;
      lastPos.current = getPos(e);
      setIsEmpty(false);

      // Draw a dot on click/tap with no movement
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pos = getPos(e);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
    },
    [getPos]
  );

  const draw = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawing.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      lastPos.current = pos;
    },
    [getPos]
  );

  const stopDrawing = useCallback((e) => {
    e?.preventDefault();
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }, []);

  // Initialise canvas background on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ffffff";
  }, []);

  const getDataURL = useCallback(() => {
    return canvasRef.current?.toDataURL("image/png");
  }, []);

  return {
    canvasRef,
    isEmpty,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    getDataURL,
  };
}
