import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { apiRouter } from './routes/api.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Main router mounting
app.use('/api', apiRouter);

// Base route for server health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'ApnaKissan Agriculture Engine API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorMiddleware);


// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[ApnaKissan] Server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('[ApnaKissan] DB connection failed, but starting server in Mock mode');
  app.listen(PORT, () => {
    console.log(`[ApnaKissan] Server listening on port ${PORT} (MOCK DB MODE)`);
  });
});
