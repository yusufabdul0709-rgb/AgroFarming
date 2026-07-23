import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('[DB] MONGODB_URI not found in env. Running in localized lowdb/mock memory mode.');
    return Promise.resolve(false);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    throw error;
  }
};
