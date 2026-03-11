import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import connectDB from "./config/db.js";
import passport, { initializePassport } from "./config/passport.js";
import {
    securityHeaders,
    globalLimiter,
    authLimiter,
    sanitize,
    parameterPollution,
} from "./middleware/security.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
if (!process.env.MONGO_URI) {
    dotenv.config({ path: "./server/.env" });
}

// Initialize Passport strategies AFTER env variables are loaded
initializePassport();

const app = express();

const allowedOrigins = [
    "https://luxegear-vip.vercel.app",
    "https://luxegear-frontend.vercel.app",
    "https://luxegear.vercel.app",
    "http://localhost:5173",
    "http://localhost:5000",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Rejected: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

connectDB();

// ── Security Middleware ────────────────────────────────────────────────
app.use(securityHeaders);
app.use(globalLimiter);
app.use(sanitize);
app.use(parameterPollution);

// ── Body Parsing (10kb limit to prevent payload attacks) ───────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Passport Initialization ───────────────────────────────────────────
app.use(passport.initialize());

// ── Request Logger ────────────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.send("LuxeGear API is running");
});

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), service: "LuxeGear API" });
});

// ── 404 & Error Handler ───────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Database: ${process.env.MONGO_URI}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Security: Helmet ✓ | Rate Limiting ✓ | Mongo Sanitize ✓ | HPP ✓`);
    console.log(`Auth: Passport.js (Local + JWT) ✓ | Refresh Tokens ✓ | Account Lockout ✓`);
});
