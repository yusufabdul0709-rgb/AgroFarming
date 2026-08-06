import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[DB] MongoDB Connection failed: ${error.message}`);
    console.error('[DB] Please make sure your MONGODB_URI is valid in .env.');
    process.exit(1);
  }
};
