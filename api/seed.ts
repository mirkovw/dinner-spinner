import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { Dish } from './models/Dish.js';

dotenv.config();

const sampleDishes = [
  {
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and bacon',
    cuisine: 'Italian',
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    cuisine: 'Indian',
  },
  {
    name: 'Beef Tacos',
    description: 'Seasoned ground beef in crispy shells with fresh toppings',
    cuisine: 'Mexican',
  },
  {
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, peanuts, and lime',
    cuisine: 'Thai',
  },
  {
    name: 'Greek Salad',
    description: 'Fresh vegetables with feta cheese and olives',
    cuisine: 'Greek',
  },
  {
    name: 'Chicken Fried Rice',
    description: 'Wok-fried rice with vegetables and tender chicken',
    cuisine: 'Chinese',
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    cuisine: 'Italian',
  },
  {
    name: 'Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, and cheese',
    cuisine: 'American',
  },
  {
    name: 'Sushi Roll Platter',
    description: 'Assorted fresh sushi rolls with soy sauce and wasabi',
    cuisine: 'Japanese',
  },
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce with Caesar dressing and croutons',
    cuisine: 'American',
  },
];

async function seed() {
  try {
    // eslint-disable-next-line no-console
    console.log('Connecting to database...');
    await connectDB();

    // eslint-disable-next-line no-console
    console.log('Clearing existing dishes...');
    await Dish.deleteMany({});

    // eslint-disable-next-line no-console
    console.log('Adding sample dishes...');
    await Dish.insertMany(sampleDishes);

    // eslint-disable-next-line no-console
    console.log(`Successfully added ${sampleDishes.length} dishes!`);
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
