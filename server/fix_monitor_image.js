import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const fixImage = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the monitor and remove the first image if it exists
        const monitor = await Product.findOne({ name: /UltraWide 49" Super Monitor/i });

        if (!monitor) {
            console.log('Monitor not found in database');
            process.exit(0);
        }

        console.log('Current images:', monitor.images);

        // Remove the first image (which was the broken one)
        // Note: I already tried to replace it earlier, so it might be the new one or still the old one.
        // The user says "main one isnt working just remove it".
        // I'll filter out the broken one or just pop the first one if it's the one I added or the original.

        const brokenUrl = 'https://images.unsplash.com/photo-1571941982-6b77d5637ae2?w=600&q=80';
        const myReplacer = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80';

        monitor.images = monitor.images.filter(img => img !== brokenUrl && img !== myReplacer);

        await monitor.save();
        console.log('Updated images:', monitor.images);
        console.log('Successfully removed the broken image!');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fixImage();
