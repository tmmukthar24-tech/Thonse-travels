import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve client production build if dist directory exists
const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(expressStaticGzipFallback(distPath));

  // SPA fallback for client-side routing
  app.get("*", (req, res) => {
    // If it's an unhandled API route, return 404 JSON instead of index.html
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(
      "Thonse Tours & Travels API is running. Client build not found — run 'npm run build' to generate frontend assets."
    );
  });
}

function expressStaticGzipFallback(dir) {
  // Simple static file serving middleware
  return (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    const filePath = path.join(dir, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
    next();
  };
}

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`[server] Thonse Tours & Travels running on port ${PORT}`);
  });
});
