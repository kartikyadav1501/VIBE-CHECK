import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

export default API;

// Submit Feedback
export const submitFeedback = (text, department) =>
  API.post("/analyze", {
    text,
    department
  });

// Get Stats (for dashboard)
export const getAnalytics = () =>
  API.get("/stats");

// Get History (recent feedback list)
export const getMonthlyTrend = () =>
  API.get("/history");
