# Code Correction Quiz App

A full-stack web application for administering and taking code correction quizzes. Built with React (Vite) for the frontend and Express with Prisma for the backend.

## Features

- User registration and authentication
- 10-question code correction quiz with per-question timers
- Automatic grading of code answers
- Export functionality for quiz results
- Admin panel for viewing submissions

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (local) / PostgreSQL (production)
- JWT Authentication
- bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies for both client and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up the database:
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. Start both client and server:
   ```bash
   # From root directory
   npm run dev:all
   ```

5. Open your browser to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3001
```

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seed data
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Quiz
- `GET /api/quiz` - Get quiz questions
- `POST /api/quiz/answers` - Submit batch of answers
- `POST /api/quiz/submit` - Final quiz submission
- `GET /api/quiz/submission/:id` - Get submission results

### Admin
- `GET /api/admin/export` - Export all submissions as CSV (admin only)

## Default Admin Credentials

After running the database seed, you can use these credentials for admin access:

- Email: `admin@example.com`
- Password: `admin123`

## Deployment

### Frontend (Netlify)

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variable in Netlify:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

### Backend (Render)

1. Build the server:
   ```bash
   cd server
   npm run build
   ```

2. Deploy to Render with the following settings:

   **Build Command:**
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```

   **Start Command:**
   ```bash
   npm start
   ```

3. Set environment variables in Render:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-frontend-url.com
   ```

## Database Migrations

### Local Development
```bash
cd server
npx prisma db push
```

### Production
```bash
cd server
npx prisma migrate deploy
```

## Scripts

### Root Scripts
- `npm run dev:all` - Start both client and server in development
- `npm run build:all` - Build both client and server
- `npm run start:all` - Start both client and server in production

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data

## License

MIT