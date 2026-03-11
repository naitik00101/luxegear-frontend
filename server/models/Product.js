import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, enum: ["headphones", "keyboards", "monitors", "mice", "accessories"] },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        stock: { type: Number, default: 0, min: 0 },
        newArrival: { type: Boolean, default: false },
        isSale: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        images: [{ type: String }],
        description: { type: String, required: true },
        specs: { type: Object, default: {} },
        tags: [{ type: String }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual("discountPercent").get(function () {
    if (this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
