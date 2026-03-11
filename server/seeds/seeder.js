
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const products = [
    { name: "SonicPro X1 Wireless Headphones", category: "headphones", price: 24999, originalPrice: 34999, rating: 4.8, reviewCount: 2847, stock: 15, newArrival: false, isSale: true, isFeatured: true, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80"], description: "Experience audio like never before with the SonicPro X1. Featuring 40mm custom drivers, Active Noise Cancellation, and up to 40 hours of playback on a single charge.", specs: { "Driver Size": "40mm", "Frequency Response": "20Hz-20kHz", "Battery Life": "40 hours", "Connectivity": "Bluetooth 5.3", "Noise Cancellation": "Active (ANC)", "Weight": "250g" }, tags: ["wireless", "anc", "premium", "audiophile"] },
    { name: "ProKey Mechanical Keyboard", category: "keyboards", price: 15499, originalPrice: 15499, rating: 4.9, reviewCount: 1563, stock: 8, newArrival: true, isSale: false, isFeatured: true, images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80", "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80"], description: "The ProKey Mechanical Keyboard is engineered for professionals who demand speed and precision. Custom hot-swap switches, per-key RGB lighting, and premium aluminum case.", specs: { "Switch Type": "Custom Linear (Hot-swap)", "Layout": "TKL 87-Key", "Backlight": "Per-Key RGB", "Case": "Aluminum CNC", "Connectivity": "USB-C / Wireless", "Polling": "1000Hz" }, tags: ["mechanical", "rgb", "hot-swap", "tenkeyless"] },
    { name: "VisionCurve 32\" 4K Monitor", category: "monitors", price: 54999, originalPrice: 69999, rating: 4.7, reviewCount: 934, stock: 4, newArrival: false, isSale: true, isFeatured: true, images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80", "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", "https://images.unsplash.com/photo-1608613517688-98c2e41b3e8c?w=600&q=80"], description: "The VisionCurve 32\" brings your creative work to life with stunning 4K resolution, 144Hz refresh rate, and HDR600 support.", specs: { "Panel Size": "32 inches", "Resolution": "3840x2160 (4K)", "Refresh Rate": "144Hz", "Panel Type": "IPS Curved 1500R", "HDR": "HDR600", "Response Time": "1ms GtG" }, tags: ["4k", "curved", "144hz", "hdr", "ips"] },
    { name: "SwiftGlide Pro Mouse", category: "mice", price: 7499, originalPrice: 9999, rating: 4.6, reviewCount: 3201, stock: 22, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80", "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80", "https://images.unsplash.com/photo-1622034812795-9741e4671db1?w=600&q=80"], description: "Designed for competitive gaming and professional productivity. 25,600 DPI optical sensor, 6 customizable buttons, ultra-lightweight 68g design.", specs: { "Sensor": "Optical 25,600 DPI", "Weight": "68g", "Buttons": "6 Programmable", "Battery": "70 hours", "Connectivity": "2.4GHz Wireless / USB-C", "Polling": "1000Hz" }, tags: ["wireless", "gaming", "lightweight", "precision"] },
    { name: "NovaPod Elite Earbuds", category: "headphones", price: 14999, originalPrice: 14999, rating: 4.5, reviewCount: 5621, stock: 30, newArrival: true, isSale: false, isFeatured: true, images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80", "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&q=80"], description: "The NovaPod Elite earbuds redefine true wireless audio with adaptive ANC, spatial audio, and 32-hour battery life.", specs: { "Driver Size": "11mm Dynamic", "ANC": "Adaptive Hybrid", "Battery (buds)": "8 hours", "Battery (case)": "24 hours", "Connectivity": "Bluetooth 5.3", "Water Rating": "IPX5" }, tags: ["earbuds", "anc", "spatial-audio", "wireless"] },
    { name: "ArcPad Pro Drawing Tablet", category: "accessories", price: 21999, originalPrice: 24999, rating: 4.8, reviewCount: 712, stock: 6, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80", "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&q=80", "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80"], description: "8192 pressure levels, 60° tilt recognition, and glass surface for digital artists.", specs: { "Active Area": "13.3x8.4 inches", "Pressure Levels": "8192", "Tilt": "±60°", "Resolution": "5080 LPI", "Connectivity": "USB-C", "Keys": "8 + Scroll Wheel" }, tags: ["drawing", "creative", "stylus", "art"] },
    { name: "StreamCam 4K Pro", category: "accessories", price: 13999, originalPrice: 15999, rating: 4.6, reviewCount: 1890, stock: 11, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", "https://images.unsplash.com/photo-1604093772284-32db2437f5bd?w=600&q=80", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"], description: "Sony EXMOR sensor, AI auto-focus, face tracking, dual stereo microphone for streaming.", specs: { "Resolution": "4K 30fps / 1080p 60fps", "Sensor": "Sony EXMOR", "FOV": "90°", "Microphone": "Dual Stereo", "Connectivity": "USB-C", "Features": "AI Auto-Focus, Face Tracking" }, tags: ["streaming", "4k", "webcam", "creator"] },
    { name: "MagCharge Wireless Pad", category: "accessories", price: 4999, originalPrice: 4999, rating: 4.4, reviewCount: 4102, stock: 50, newArrival: true, isSale: false, isFeatured: false, images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80", "https://images.unsplash.com/photo-1618560044832-7b3e5e88e073?w=600&q=80", "https://images.unsplash.com/photo-1576613109753-27804de2cce8?w=600&q=80"], description: "15W fast wireless charging, Qi universal, charge 3 devices simultaneously.", specs: { "Max Output": "15W", "Compatibility": "Qi Universal", "Simultaneous": "3 devices", "Design": "Tempered Glass + Aluminum", "LED": "Ambient Glow", "Cable": "USB-C (included)" }, tags: ["wireless-charging", "qi", "fast-charge", "desk"] },
    { name: "TypeMaster Compact Keyboard", category: "keyboards", price: 11499, originalPrice: 11499, rating: 4.7, reviewCount: 882, stock: 14, newArrival: true, isSale: false, isFeatured: false, images: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80", "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80", "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=600&q=80"], description: "Cherry MX switches, PBT double-shot keycaps, gasket mount — premium in a 65% body.", specs: { "Switch": "Cherry MX", "Layout": "65% Compact", "Keycaps": "PBT Double-Shot", "Mount": "Gasket", "Connectivity": "Bluetooth 5.0 / USB-C", "Battery": "4000mAh" }, tags: ["compact", "65%", "cherry-mx", "bluetooth"] },
    { name: "ViperPad XL Deskmat", category: "accessories", price: 4499, originalPrice: 5999, rating: 4.9, reviewCount: 6703, stock: 100, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?w=600&q=80", "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80", "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80"], description: "900x400mm micro-weave deskmat, anti-slip rubber base, machine stitched edges.", specs: { "Size": "900x400x4mm", "Surface": "Micro-Weave Cloth", "Base": "Anti-Slip Rubber", "Edges": "Machine Stitched", "Compatibility": "All Sensors", "Wash Safe": "Yes" }, tags: ["deskmat", "gaming", "large", "mousepad"] },
    { name: "PrecisionClick Elite Mouse", category: "mice", price: 10499, originalPrice: 10499, rating: 4.8, reviewCount: 2234, stock: 17, newArrival: true, isSale: false, isFeatured: false, images: ["https://images.unsplash.com/photo-1563297007-0686b7003af7?w=600&q=80", "https://images.unsplash.com/photo-1517430816045-df4b7de11280?w=600&q=80", "https://images.unsplash.com/photo-1640955785023-1854685dde4a?w=600&q=80"], description: "36,000 DPI PixArt sensor, optical switches, PTFE feet, 55g wired precision mouse.", specs: { "Sensor": "PixArt PAW3395 36,000 DPI", "Switches": "Optical (100M clicks)", "Feet": "100% PTFE", "Weight": "55g", "Connectivity": "USB-C wired", "Polling": "4000Hz" }, tags: ["wired", "precision", "gaming", "optical-switch"] },
    { name: "UltraWide 49\" Super Monitor", category: "monitors", price: 114999, originalPrice: 149999, rating: 4.9, reviewCount: 421, stock: 2, newArrival: false, isSale: true, isFeatured: true, images: ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80", "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80"], description: "5120x1440 DQHD, 240Hz, 1ms, 1800R curved VA — apex of multitasking.", specs: { "Panel Size": "49 inches", "Resolution": "5120x1440 DQHD", "Refresh Rate": "240Hz", "Curve": "1800R", "Panel Type": "VA", "HDR": "HDR1000" }, tags: ["ultrawide", "49-inch", "dqhd", "240hz"] },
    { name: "AuraGlow LED Desk Lamp", category: "accessories", price: 6499, originalPrice: 8499, rating: 4.5, reviewCount: 1120, stock: 25, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", "https://images.unsplash.com/photo-1567585469093-e78e63f5f1f3?w=600&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"], description: "2700K-6500K adjustable, 10 brightness levels, wireless charging base, USB-A port.", specs: { "Color Temp": "2700K-6500K", "Brightness": "10 levels", "Max Output": "1000 Lux", "Base": "Wireless Charging 10W", "USB": "USB-A 5W", "Reach": "adjustable 50cm" }, tags: ["desk-lamp", "led", "wireless-charging", "rgb"] },
    { name: "NexAudio Soundbar 2.1", category: "headphones", price: 29999, originalPrice: 39999, rating: 4.7, reviewCount: 678, stock: 9, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"], description: "300W RMS, wireless subwoofer, Dolby Atmos, HDMI ARC, Bluetooth 5.3.", specs: { "Total Output": "300W RMS", "Channels": "2.1", "Subwoofer": "Wireless 6.5\" Driver", "Audio Formats": "Dolby Atmos, DTS:X", "Connectivity": "HDMI ARC, Bluetooth, Optical", "Dimensions": "120x8x6cm" }, tags: ["soundbar", "dolby-atmos", "2.1", "home-audio"] },
    { name: "ErgoLift Laptop Stand", category: "accessories", price: 5999, originalPrice: 5999, rating: 4.6, reviewCount: 3450, stock: 42, newArrival: true, isSale: false, isFeatured: false, images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80", "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80"], description: "Aluminum adjustable laptop stand, 6 height settings, passive cooling, foldable.", specs: { "Material": "Aircraft Aluminum", "Height Settings": "6 levels", "Compatibility": "Laptops up to 17\"", "Max Load": "10kg", "Weight": "580g", "Foldable": "Yes" }, tags: ["laptop-stand", "ergonomic", "aluminum", "portable"] },
    { name: "HexCharge 10-Port USB Hub", category: "accessories", price: 8499, originalPrice: 10999, rating: 4.5, reviewCount: 2215, stock: 20, newArrival: false, isSale: true, isFeatured: false, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80"], description: "USB-C PD 100W, 4x USB-A 3.0, SD/microSD, HDMI 4K, Gigabit Ethernet — 10 ports.", specs: { "USB-C PD": "100W Passthrough", "USB-A 3.0": "4 ports (5Gbps)", "SD/microSD": "UHS-I (104MB/s)", "HDMI": "4K 60Hz", "Ethernet": "Gigabit (1000Mbps)", "Total Ports": "10" }, tags: ["usb-hub", "connectivity", "usb-c", "desk"] },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding...");


        await Promise.all([Product.deleteMany(), Order.deleteMany(), User.deleteMany()]);
        console.log("Cleared existing data");


        const created = await Product.insertMany(products);
        console.log(`Seeded ${created.length} products`);


        const admin = await User.create({
            name: "Admin",
            email: "admin@luxegear.com",
            password: "admin123",
            role: "admin",
        });
        console.log(`Admin created: ${admin.email} / password: admin123`);


        const demo = await User.create({
            name: "Demo User",
            email: "demo@luxegear.com",
            password: "demo123",
            role: "user",
        });
        console.log(`Demo user created: ${demo.email} / password: demo123`);

        console.log("\nSeed complete!\n");
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err.message);
        process.exit(1);
    }
};

seed();
