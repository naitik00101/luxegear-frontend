import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const shippingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: "US" },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        guestEmail: { type: String },
        items: [orderItemSchema],
        shipping: shippingSchema,
        couponCode: { type: String, default: "" },
        discountPercent: { type: Number, default: 0 },
        subtotal: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        shippingCost: { type: Number, default: 0 },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
