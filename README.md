# Dinner Spinner

A fun full-stack web app that helps you decide what to eat! Built with TypeScript, React, Express, and MongoDB. Can't decide on dinner? Just spin the wheel and let fate decide!

## Features

- **Dinner Spinner**: Animated wheel that randomly selects a dish from your database
- **Dish Management**: Add, view, and delete dishes with ease
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Full-Stack TypeScript**: Type-safe code from frontend to backend
- **MongoDB Database**: Persistent storage for all your favorite dishes
- **Serverless Ready**: Optimized for Vercel deployment

## Tech Stack

### Frontend
- React 19
- Vite (build tool & dev server)
- TypeScript
- Tailwind CSS
- Fetch-based API client

### Backend
- Express.js
- MongoDB (Mongoose ODM)
- TypeScript
- CORS enabled
- Environment variable support (dotenv)

### Development Tools
- ESLint (flat config with TypeScript & React support)
- Prettier (code formatting)
- tsx (TypeScript execution with watch mode)
- Concurrently (run multiple dev servers)

## Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd react-express-mongodb-boilerplate
npm install
```

The `postinstall` script automatically installs dependencies in both `/api` and `/client` directories.

### 2. Configure Environment Variables

Create a `.env` file in the `/api` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3000
```

### 3. Start Development Servers

```bash
npm run dev
```

This starts:
- API server at `http://localhost:3000`
- Vite dev server at `http://localhost:5173`

The Vite dev server proxies API requests to the Express backend, so you can call `/api/health` from your frontend code.

### 4. Seed the Database (Optional)

To populate your database with sample dishes:

```bash
cd api
npm run seed
cd ..
```

This will add 10 sample dishes including Italian, Indian, Mexican, Thai, and more cuisines.

### 5. Start Using the Dinner Spinner

Open `http://localhost:5173` in your browser. You'll see:
- A spinning wheel interface
- A big "SPIN FOR DINNER!" button
- Your list of dishes below
- Options to add or delete dishes

## Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both API and client in development mode |
| `npm run dev:api` | Start only the API server with watch mode |
| `npm run dev:client` | Start only the Vite dev server |
| `npm run build` | Build client for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint all TypeScript files |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### API Directory (`cd api`)

| Command | Description |
|---------|-------------|
| `npm run seed` | Seed database with sample dishes |
| `npm run lint` | Lint API TypeScript files |
| `npm run format` | Format API code |

### Client Directory (`cd client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production (TypeScript check + Vite build) |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint client code |
| `npm run format` | Format client code |

## Project Structure

```
.
├── api/                    # Express backend
│   ├── db.ts              # MongoDB connection with caching
│   ├── index.ts           # Express app & routes
│   ├── package.json       # API dependencies
│   └── tsconfig.json      # API TypeScript config
├── client/                # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts  # API fetch wrapper
│   │   ├── App.tsx        # Main React component
│   │   ├── main.tsx       # React entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── package.json       # Client dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── tailwind.config.js # Tailwind CSS config
├── eslint.config.mjs      # Shared ESLint config
├── package.json           # Root package with scripts
├── vercel.json            # Vercel deployment config
└── README.md
```

## API Endpoints

The app provides the following endpoints:

- `GET /api/health` - Health check with database status
- `GET /api/dishes` - Get all dishes from database
- `GET /api/dishes/random` - Get a random dish
- `POST /api/dishes` - Add a new dish (requires `name`, optional `description` and `cuisine`)
- `DELETE /api/dishes/:id` - Delete a dish by ID

## Deployment to Vercel

### 1. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Configure Environment Variables

In Vercel dashboard, add:
- `MONGODB_URI` - Your MongoDB connection string
- Any other environment variables your app needs

The `vercel.json` configuration:
- Builds the client to static files
- Deploys the API as a serverless function
- Routes all `/api/*` requests to the serverless function

## Development Tips

### Hot Reload

Both client and API support hot reload:
- **Client**: Vite provides instant HMR
- **API**: tsx watch mode restarts the server on file changes

### Database Connection

The `connectDB()` function in `api/db.ts` caches the MongoDB connection. This is crucial for serverless deployments where:
- Function instances may be reused
- Creating new connections on every request would be slow and hit connection limits

### Adding New API Routes

1. Open `api/index.ts`
2. Add your route (remember to prefix with `/api`)
3. Call `await connectDB()` if you need database access
4. Define TypeScript types for request/response

### Adding Mongoose Models

1. Create a new file in `api/` (e.g., `api/models/User.ts`)
2. Define your schema and model
3. Import and use in your routes

Example:
```typescript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

export const User = mongoose.model('User', userSchema);
```

## Customization

### Styling

The project uses Tailwind CSS. Customize:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles and Tailwind directives

### ESLint Rules

Modify `eslint.config.mjs` to adjust linting rules for your team's preferences.

### TypeScript Configuration

- Root `tsconfig.json` - Shared compiler options
- `api/tsconfig.json` - API-specific settings
- `client/tsconfig.json` - Client-specific settings

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:
- Change API port: Set `PORT=3001` in `api/.env`
- Change client port: Modify `server.port` in `client/vite.config.ts`

### Database Connection Issues

- Verify `MONGODB_URI` is correct in `api/.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Build Errors

Run TypeScript check separately:
```bash
cd client
npx tsc --noEmit
```

This will show detailed type errors.

### Module Not Found in Production (Vercel)

If you see errors like `Cannot find module '/var/task/api/db'` when deployed to Vercel:

**Cause**: The API uses ES modules (`"type": "module"` in `api/package.json`). Node.js requires explicit file extensions for ES module imports.

**Solution**: Always use `.js` extensions when importing local TypeScript files in the `api/` directory:

```typescript
// ✅ Correct
import { connectDB } from './db.js';

// ❌ Wrong - works with tsx locally but fails in production
import { connectDB } from './db';
```

Even though your source file is `db.ts`, you must reference `db.js` because that's what exists after TypeScript compilation. The `tsx` dev tool is lenient and doesn't require extensions, but production Node.js does.

## License

MIT
