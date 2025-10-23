import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
  if (cachedConnection) {
    // eslint-disable-next-line no-console
    console.log('Using cached database connection');
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    cachedConnection = connection;
    // eslint-disable-next-line no-console
    console.log('New database connection established');
    return connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database connection error:', error);
    throw error;
  }
}
