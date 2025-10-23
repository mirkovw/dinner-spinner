import mongoose from 'mongoose';

export interface IDish {
  name: string;
  description?: string;
  cuisine?: string;
  createdAt: Date;
}

const dishSchema = new mongoose.Schema<IDish>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cuisine: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Dish = mongoose.model<IDish>('Dish', dishSchema);
