import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// ── Helmet — Security headers ──────────────────────────────────────────
export const securityHeaders = helmet({
    contentSecurityPolicy: false,        // disabled so frontend can load freely
    crossOriginEmbedderPolicy: false,    // allows loading external images (dicebear, etc.)
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows resources to be shared across origins
});

// ── Global rate limiter — 100 requests per 15 min window ───────────────
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

// ── Auth rate limiter — 5 requests per 15 min (brute-force protection) ─
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again after 15 minutes",
    },
});

// ── NoSQL Injection Prevention ─────────────────────────────────────────
export const sanitize = mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
        console.warn(`[Security] Sanitized ${key} in ${req.method} ${req.url}`);
    },
});

// ── HTTP Parameter Pollution ───────────────────────────────────────────
export const parameterPollution = hpp({
    whitelist: [
        "price", "rating", "category", "sort", "page", "limit",
        "minPrice", "maxPrice", "minRating", "inStock", "search", "status",
    ],
});
