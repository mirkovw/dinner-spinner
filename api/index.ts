import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const { readyState } = db.connection;

    const returnObj = {
      status: 'ok',
      message: 'API is running',
      database: '',
    };

    switch (readyState) {
      case 0:
        returnObj.database = 'disconnected';
        break;
      case 1:
        returnObj.database = 'connected';
        break;
      case 2:
        returnObj.database = 'connecting';
        break;
      case 3:
        returnObj.database = 'disconnecting';
        break;
      default: {
        returnObj.database = 'unknown';
        break;
      }
    }

    return res.json(returnObj);
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// Example API endpoint
app.get('/api/hello', async (req: Request, res: Response) => {
  await connectDB();
  res.json({ message: 'Hello from the API!' });
});

// Example POST endpoint
app.post('/api/data', async (req: Request, res: Response) => {
  await connectDB();
  const { data } = req.body;
  res.json({ received: data, timestamp: new Date() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
