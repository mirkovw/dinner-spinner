import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { Dish } from './models/Dish.js';

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

// Get all dishes
app.get('/api/dishes', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

// Get a random dish
app.get('/api/dishes/random', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const count = await Dish.countDocuments();

    if (count === 0) {
      return res.status(404).json({ error: 'No dishes found in database' });
    }

    const random = Math.floor(Math.random() * count);
    const dish = await Dish.findOne().skip(random);
    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random dish' });
  }
});

// Add a new dish
app.post('/api/dishes', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { name, description, cuisine } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    const dish = new Dish({ name, description, cuisine });
    await dish.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dish' });
  }
});

// Delete a dish
app.delete('/api/dishes/:id', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dish' });
  }
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
