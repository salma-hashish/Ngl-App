import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectDB() {
    try {
        await mongoose.connect(env.db.url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
}

export default connectDB;
