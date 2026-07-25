import { initMySQL } from './mysql.js';

export const connectDB = async () => {
  try {
    await initMySQL();
    console.log('[DB] MySQL Database connected and tables initialized.');
    return true;
  } catch (error) {
    console.error(`[DB] MySQL Connection failed: ${error.message}`);
    console.error('[DB] Please make sure MySQL server is running and your .env credentials match.');
    throw error;
  }
};
