import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

/**
 * Send a base64-encoded canvas image to the FastAPI backend.
 * @param {string} imageDataUrl - data:image/png;base64,... string from canvas.toDataURL()
 * @returns {{ digit: number, confidence: number }}
 */
export async function predictDigit(imageDataUrl) {
  const { data } = await api.post("/predict", { image: imageDataUrl });
  return data;
}

export default api;
