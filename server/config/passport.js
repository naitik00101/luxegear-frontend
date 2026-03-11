import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

// ── Initialize Passport Strategies ─────────────────────────────────────
// Called AFTER dotenv.config() has loaded environment variables
export const initializePassport = () => {
    // ── Local Strategy (email + password login) ────────────────────────
    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email: email.toLowerCase() }).select(
                        "+password +loginAttempts +lockUntil"
                    );

                    if (!user) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    // Check if account is locked
                    if (user.isLocked()) {
                        const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
                        return done(null, false, {
                            message: `Account locked. Try again in ${minutesLeft} minute(s)`,
                        });
                    }

                    // Verify password
                    const isMatch = await user.comparePassword(password);

                    if (!isMatch) {
                        await user.incrementLoginAttempts();
                        const attemptsLeft = 5 - (user.loginAttempts + 1);

                        if (attemptsLeft <= 0) {
                            return done(null, false, {
                                message: "Account locked due to too many failed attempts. Try again in 30 minutes",
                            });
                        }

                        return done(null, false, {
                            message: `Invalid email or password. ${attemptsLeft} attempt(s) remaining`,
                        });
                    }

                    // Successful login — reset attempts
                    if (user.loginAttempts > 0 || user.lockUntil) {
                        await user.resetLoginAttempts();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    // ── JWT Strategy (token-based auth for protected routes) ───────────
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new JwtStrategy(jwtOptions, async (payload, done) => {
            try {
                const user = await User.findById(payload.id).select("+passwordChangedAt");

                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                // Check if password was changed after token was issued
                if (user.passwordChangedAt) {
                    const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
                    if (payload.iat < changedAt) {
                        return done(null, false, { message: "Password changed. Please log in again" });
                    }
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );
};

export default passport;
