import express from "express";
import passport from "passport";
import User from "../models/User.js";
import { protect, generateTokens } from "../middleware/auth.js";

const router = express.Router();

// ── POST /register ─────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: "All fields are required" });

    if (password.length < 6)
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    // Password strength: require at least one uppercase, one lowercase, one digit
    const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strengthRegex.test(password)) {
        console.log(`[Auth] Registration failed for ${email}: Password strength requirement not met`);
        return res.status(400).json({
            success: false,
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
        });
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = await generateTokens(user._id, user.role);

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    });
});

// ── POST /login ────────────────────────────────────────────────────────
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, async (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: info?.message || "Invalid email or password",
            });
        }

        const { accessToken, refreshToken } = await generateTokens(user._id, user.role);

        res.json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    })(req, res, next);
});

// ── POST /refresh-token ────────────────────────────────────────────────
router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ success: false, message: "Refresh token is required" });

    // Find user that owns this refresh token
    const user = await User.findOne({ "refreshTokens.token": refreshToken }).select(
        "+refreshTokens"
    );

    if (!user)
        return res.status(401).json({ success: false, message: "Invalid refresh token" });

    // Remove the used refresh token (token rotation)
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    await user.save({ validateBeforeSave: false });

    // Issue new token pair
    const tokens = await generateTokens(user._id, user.role);

    res.json({
        success: true,
        message: "Token refreshed",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
});

// ── POST /logout ───────────────────────────────────────────────────────
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        // Remove the specific refresh token from the user
        await User.findOneAndUpdate(
            { "refreshTokens.token": refreshToken },
            { $pull: { refreshTokens: { token: refreshToken } } }
        );
    }

    res.json({ success: true, message: "Logged out successfully" });
});

// ── PUT /change-password ───────────────────────────────────────────────
router.put("/change-password", protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        return res.status(400).json({ success: false, message: "Current and new password are required" });

    if (newPassword.length < 6)
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

    const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strengthRegex.test(newPassword))
        return res.status(400).json({
            success: false,
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
        });

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword)))
        return res.status(401).json({ success: false, message: "Current password is incorrect" });

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    // Issue fresh tokens for this session
    const tokens = await generateTokens(user._id, user.role);

    res.json({
        success: true,
        message: "Password changed successfully. All other sessions have been logged out",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
});

// ── GET /me ────────────────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

// ── PUT /me ────────────────────────────────────────────────────────────
router.put("/me", protect, async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
    );
    res.json({ success: true, user });
});

export default router;
