import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { items, shipping, couponCode, discountPercent, subtotal, discountAmount, shippingCost, total, guestEmail } = req.body;

    if (!items || items.length === 0)
        return res.status(400).json({ success: false, message: "No items in order" });

    const orderItems = [];
    for (const item of items) {
        const product = await Product.findById(item.id || item.product);
        if (!product) return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
        if (product.stock < item.quantity)
            return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

        product.stock -= item.quantity;
        await product.save();

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            quantity: item.quantity,
        });
    }

    const token = req.headers.authorization?.split(" ")[1];
    let userId = null;
    if (token) {
        try {
            const jwt = await import("jsonwebtoken");
            const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (_err) {
            // Token verification failed or JWT not available, proceed as guest
        }
    }

    const order = await Order.create({
        user: userId,
        guestEmail: userId ? undefined : (guestEmail || shipping.email),
        items: orderItems,
        shipping,
        couponCode: couponCode || "",
        discountPercent: discountPercent || 0,
        subtotal,
        discountAmount: discountAmount || 0,
        shippingCost: shippingCost || 0,
        total,
    });

    res.status(201).json({ success: true, message: "Order placed successfully", orderId: order._id, order });
});

router.get("/my", protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.product", "name images");
    res.json({ success: true, orders });
});

router.get("/:id", protect, async (req, res) => {
    const order = await Order.findById(req.params.id).populate("items.product", "name images").populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user?._id?.toString() !== req.user._id.toString() && req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Not authorized" });
    res.json({ success: true, order });
});

export default router;
