# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript boilerplate with React + Vite frontend, Express backend, and MongoDB database. The project is structured as a monorepo with separate client and API directories, designed for deployment on Vercel.

## Monorepo Structure

- **Root**: Shared tooling (ESLint, Prettier, TypeScript configs) with npm scripts that orchestrate both client and API
- **`/api`**: Express + MongoDB backend (ES modules, runs on Node.js)
- **`/client`**: React + Vite + Tailwind CSS frontend (ES modules)

Each directory has its own `package.json` and dependencies. Root `postinstall` script automatically installs dependencies in both directories.

## Development Commands

### Start Development Environment
```bash
npm run dev
```
This runs both API (port 3000) and client (port 5173) concurrently. Vite dev server proxies `/api` requests to the Express backend at `localhost:3000`.

### Individual Services
```bash
npm run dev:api      # Start only API server with watch mode (tsx watch)
npm run dev:client   # Start only Vite dev server
```

### Building
```bash
npm run build        # Build client for production (TypeScript check + Vite build)
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Lint all files
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format all code with Prettier
npm run format:check # Check formatting without changing files
```

## Architecture

### Database Connection (`api/db.ts`)
- **Connection caching**: Implements a singleton pattern to reuse MongoDB connections across serverless invocations
- `connectDB()` returns cached connection if available, otherwise creates new connection
- Required for serverless environments (Vercel) where function instances may be reused

### API Server (`api/index.ts`)
- **Dual-mode**: Starts HTTP server in development (`NODE_ENV !== 'production'`), exports Express app for Vercel serverless in production
- All endpoints start with `/api` prefix
- Database connection is lazy - called per-request via `await connectDB()`
- Uses CORS middleware (configured for all origins by default)

### Frontend API Client (`client/src/api/client.ts`)
- Simple wrapper around `fetch()` with basic error handling
- Uses `VITE_API_URL` environment variable or defaults to `/api`
- In development: proxied to `localhost:3000` via Vite config
- In production: relies on Vercel rewrites to route `/api/*` to serverless function

### Deployment Configuration (`vercel.json`)
- Client builds to `client/dist` (served as static files)
- API deployed as serverless function at `/api`
- Rewrites route all `/api/*` requests to the `api/index.ts` function
- Function configured with 1024MB memory, 10s max duration

## Environment Variables

Create `.env` in `/api` directory:
```
MONGODB_URI=mongodb+srv://...
PORT=3000  # Optional, defaults to 3000
```

For client (create `client/.env` if needed):
```
VITE_API_URL=/api  # Optional, defaults to /api
```

## TypeScript Configuration

- Root `tsconfig.json` provides shared compiler options
- Each workspace (`api`, `client`) extends root config with specific settings
- API uses Node ESM modules (`"type": "module"` in package.json)
- Client uses React JSX transform

## ES Modules Important Note

**CRITICAL**: The API uses ES modules (`"type": "module"`). When importing local TypeScript files, you MUST use `.js` extensions in import statements, even though the source files are `.ts`:

```typescript
// ✅ Correct
import { connectDB } from './db.js';

// ❌ Wrong - will fail in production
import { connectDB } from './db';
```

This is required because:
- TypeScript compiles `.ts` files to `.js` files
- Node.js ES modules require explicit file extensions
- The import paths reference the compiled output, not the source files
- Works locally with `tsx` but fails in Vercel serverless without `.js` extension

## ESLint Configuration

Uses flat config format (`eslint.config.mjs`):
- TypeScript rules applied to all `.ts` files
- React + React Hooks rules only for `client/**/*.{tsx,jsx}`
- Prettier integration runs as ESLint rule
- `no-console` set to `warn` (allowed but flagged)
