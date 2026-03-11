import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 minutes

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 60,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        avatar: {
            type: String,
            default: function () {
                return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.email}`;
            },
        },

        // ── Advanced Security Fields ───────────────────────────────────
        loginAttempts: {
            type: Number,
            default: 0,
            select: false,
        },
        lockUntil: {
            type: Date,
            select: false,
        },
        refreshTokens: {
            type: [
                {
                    token: { type: String, required: true },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
            select: false,
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);

// ── Indexes ────────────────────────────────────────────────────────────
userSchema.index({ "refreshTokens.createdAt": 1 }, { expireAfterSeconds: 604800 }); // 7 days

// ── Pre-save: hash password ────────────────────────────────────────────
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// ── Instance methods ───────────────────────────────────────────────────
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementLoginAttempts = async function () {
    // If previous lock has expired, reset counter
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account after max attempts
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME_MS };
    }

    return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function () {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 },
    });
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.loginAttempts;
    delete obj.lockUntil;
    delete obj.refreshTokens;
    delete obj.passwordChangedAt;
    return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
