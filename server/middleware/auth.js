import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import User from "../models/User.js";

// ── Token Generation ───────────────────────────────────────────────────

/** Access token — short-lived (15 minutes) */
export const generateAccessToken = (userId, role) =>
    jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" });

/** Refresh token — long-lived (7 days), stored in DB */
export const generateRefreshToken = () =>
    crypto.randomBytes(40).toString("hex");

/** Generate both tokens and persist refresh token to the user doc */
export const generateTokens = async (userId, role) => {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken();

    // Store refresh token in user document (keep max 5 sessions)
    await User.findByIdAndUpdate(userId, {
        $push: {
            refreshTokens: {
                $each: [{ token: refreshToken }],
                $slice: -5,               // keep only the 5 most recent
            },
        },
    });

    return { accessToken, refreshToken };
};

// ── Passport-based Protect Middleware ───────────────────────────────────

export const protect = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            const message = info?.message || "Not authorized, token invalid or expired";
            return res.status(401).json({ success: false, message });
        }

        req.user = user;
        next();
    })(req, res, next);
};

// ── Role-based Access ──────────────────────────────────────────────────

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin")
        return res.status(403).json({ success: false, message: "Admin access required" });
    next();
};
