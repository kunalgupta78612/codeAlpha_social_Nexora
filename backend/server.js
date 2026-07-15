// ============================================================
// Nexora — Express Server Entry Point
// ============================================================

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// Database connection
import connectDB from "./config/db.js";

// ── Load environment variables ───────────────────────────────
dotenv.config();

// ── __dirname fix for ES Modules ─────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Initialize Express app ───────────────────────────────────
const app = express();

// ── Connect to MongoDB ───────────────────────────────────────
connectDB();

// ── Core Middleware ──────────────────────────────────────────

// Enable CORS — allows frontend (React) to talk to this backend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // CRA dev server (fallback)
    ],
    credentials: true, // Allow cookies / auth headers
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Static Files — Serve uploaded images ────────────────────
// Uploaded images will be accessible at: /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── API Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);   // /api/auth/register, /api/auth/login
app.use("/api/users", userRoutes);  // /api/users/:id, /api/users/follow
app.use("/api/posts", postRoutes);  // /api/posts/, /api/posts/:id/like

// ── Root health check ────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Nexora API is running!",
    version: "1.0.0",
    status: "OK",
  });
});

// ── 404 Handler — Unknown routes ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────────────
// Catches any errors passed via next(error) in controllers
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🚀 Nexora Server Running      ║
  ║   Port     : ${PORT}                    ║
  ║   Mode     : ${process.env.NODE_ENV}        ║
  ║   API Base : http://localhost:${PORT}  ║
  ╚══════════════════════════════════════╝
  `);
});

export default app;