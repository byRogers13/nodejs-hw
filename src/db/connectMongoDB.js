import mongoose from 'mongoose';

export async function connectMongoDB() {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        console.error('❌ MONGO_URL is not defined');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB connection established successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
}
