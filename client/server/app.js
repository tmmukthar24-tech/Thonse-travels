import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

app.use(cors());
app.use(express.json());

// Lazy/cached DB connect middleware for incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[app] DB connection check error:", err.message);
  }
  next();
});

// Health check endpoints (both with and without /api prefix)
const healthHandler = (req, res) => {
  res.json({ status: "ok", service: "thonse-travels-server" });
};
app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

// Fleet routes
app.use("/api/fleet", fleetRoutes);
app.use("/fleet", fleetRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);
app.use("/bookings", bookingRoutes);

// Contact routes
app.use("/api/contact", contactRoutes);
app.use("/contact", contactRoutes);

// Chatbot routes
app.use("/api/chatbot", chatbotRoutes);
app.use("/chatbot", chatbotRoutes);

export default app;
