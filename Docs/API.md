# FitTrack Documentation

## Overview

FitTrack is a comprehensive fitness tracking web application that allows users to monitor their workouts, nutrition, and overall fitness progress. The application features a React-based frontend and a Node.js/Express backend with MongoDB.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│    Frontend     │─────▶│    Backend      │─────▶│    MongoDB      │
│   (React/Vite)  │      │  (Node/Express) │      │   (Database)    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│   Vercel        │      │   Cloudinary    │
│   (Hosting)     │      │   (Images)      │
└─────────────────┘      └─────────────────┘
```

## Features

### User Management
- User registration with profile details (height, weight, age, gender)
- Email verification
- JWT-based authentication with refresh tokens
- Password reset via email
- Profile and avatar updates
- Account deletion

### Workout Tracking
- Log various workout types (running, cycling, yoga, strength, swimming, walking)
- Track duration and calories burned
- Add notes for each session
- View, edit, and delete workout history

### Diet Tracking
- Log meals by type (breakfast, lunch, dinner, snack)
- Add multiple food items per meal
- Track macronutrients (calories, protein, carbs, fat)
- Auto-calculated totals per meal

### Progress Monitoring
- Track BMI (auto-calculated from height/weight)
- Track body fat percentage
- Visual progress charts over time
- Historical data view

## Security

- Passwords hashed with bcrypt
- JWT access tokens (short-lived)
- Refresh tokens (long-lived)
- HTTP-only cookies for tokens
- CORS configured for allowed origins
- Input validation with express-validator

## Deployment

### Backend (Render)
The backend is deployed on Render at: `https://fittrack-yf0o.onrender.com`

### Frontend (Vercel)
The frontend should be deployed to Vercel:
1. Connect your Git repository
2. Set Root Directory to `Frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`

## Environment Setup

### Backend (.env)
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fittrack
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIREY=1d
REFRESH_TOKEN_EXPIREY=10d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your-user
MAILTRAP_SMTP_PASS=your-password
CORS_ORIGIN=http://localhost:5173
```

### Frontend
No environment variables required. API base URL is configured in `src/lib/api.js`.

## API Reference

See [Backend README](../Backend/README.md) for complete API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
