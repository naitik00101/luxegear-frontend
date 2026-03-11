import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", async (_req, res) => {
    const [totalProducts, totalUsers, orders] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.find().select("total status createdAt"),
    ]);

    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

    const now = new Date();
    const week = new Date(now.setDate(now.getDate() - 7));
    const weeklyRevenue = orders
        .filter((o) => new Date(o.createdAt) >= week)
        .reduce((sum, o) => sum + o.total, 0);

    res.json({
        success: true,
        stats: {
            totalProducts,
            totalUsers,
            totalOrders,
            revenue,
            weeklyRevenue,
            pendingOrders,
            deliveredOrders,
        },
    });
});

router.get("/orders", async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const total = await Order.countDocuments(filter);
    const orders = await Order
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("user", "name email");

    res.json({ success: true, total, page: Number(page), orders });
});

router.put("/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status))
        return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status,
            ...(status === "delivered" ? { deliveredAt: new Date() } : {}),
        },
        { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order status updated", order });
});

router.get("/users", async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    res.json({ success: true, total, users });
});

router.put("/users/:id/role", async (req, res) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
        return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User role updated", user });
});

router.delete("/users/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
});

export default router;
