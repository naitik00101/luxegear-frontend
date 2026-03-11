import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const {
        category, search, minPrice, maxPrice, minRating,
        inStock, sort = "default", page = 1, limit = 12,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (inStock === "true") filter.stock = { $gt: 0 };
    if (search) filter.$text = { $search: search };

    const SORT_MAP = {
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        rating: { rating: -1 },
        newest: { createdAt: -1 },
        popular: { reviewCount: -1 },
        default: { isFeatured: -1, createdAt: -1 },
    };
    const sortObj = SORT_MAP[sort] || SORT_MAP.default;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        products,
    });
});

router.get("/featured", async (_req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
});

router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
});

router.post("/", protect, adminOnly, async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: "Product created", product });
});

router.put("/:id", protect, adminOnly, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product updated", product });
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
});

export default router;
