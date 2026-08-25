import axios from "axios";
import { fleetSeedData } from "../data/fleetFallback.js";

// In dev, Vite proxies /api to the Express server (see vite.config.js).
// In prod on Vercel, requests to /api route to the serverless API.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

export const fetchFleet = () =>
  api
    .get("/fleet")
    .then((res) => (Array.isArray(res.data) && res.data.length ? res.data : fleetSeedData))
    .catch((err) => {
      console.warn("[api] Failed to fetch fleet from server, using fallback data:", err.message);
      return fleetSeedData;
    });

export const createBooking = (payload) => api.post("/bookings", payload).then((res) => res.data);

export const createContact = (payload) => api.post("/contact", payload).then((res) => res.data);

export const askChatbot = (message) =>
  api.post("/chatbot", { message }).then((res) => res.data);

export default api;
