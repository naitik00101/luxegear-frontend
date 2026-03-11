import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, './.env') });

const fixLiveData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }

        console.log('Connecting to Live Database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // Update all products: rename 'isNew' to 'newArrival' if it exists
        // and ensure 'isSale' is correctly detected from originalPrice > price

        console.log('Updating product fields...');

        // 1. Convert isNew to newArrival
        const result = await Product.updateMany(
            { isNew: { $exists: true } },
            [
                { $set: { newArrival: "$isNew" } },
                { $unset: "isNew" }
            ]
        );

        console.log(`Updated ${result.modifiedCount} products with newArrival field.`);

        // 2. Ensure isSale is true for products with originalPrice > price
        const saleResult = await Product.updateMany(
            { $expr: { $gt: ["$originalPrice", "$price"] } },
            { $set: { isSale: true } }
        );

        console.log(`Updated ${saleResult.modifiedCount} products to be marked as 'On Sale'.`);

        console.log('Live data fix complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fixLiveData();
