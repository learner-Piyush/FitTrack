# FitTrack - Personalized Fitness & Sports Activity Tracker

A full-stack fitness tracking web application that allows users to log workouts, track nutrition, monitor progress, and manage their fitness journey.

## Features

- **User Authentication** - Register, login, email verification, password reset
- **Workout Tracking** - Log and manage workout sessions with type, duration, and calories
- **Diet Tracking** - Track meals and nutrition with macro breakdown (protein, carbs, fat)
- **Progress Monitoring** - Track BMI and body fat with interactive charts
- **Profile Management** - Update profile info, avatar, and settings

## Tech Stack

### Frontend
- React 19 + Vite
- React Router for routing
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for image storage
- Nodemailer for emails

## Project Structure

```
├── Frontend/           # React frontend application
├── Backend/            # Express API server
├── Docs/               # Documentation
└── README.md           # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd Backend
npm install
# Create .env file with required variables
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Backend
The backend API is deployed at: `https://fittrack-yf0o.onrender.com`

### Frontend
Deploy to Vercel:
1. Connect your Git repository
2. Set Root Directory to `Frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login user |
| `/api/v1/auth/logout` | POST | Logout user |
| `/api/v1/workout` | GET/POST | Get/Create workouts |
| `/api/v1/diet` | GET/POST | Get/Create diet logs |
| `/api/v1/progress` | GET/POST | Get/Create progress |

See [Backend README](./Backend/README.md) for full API documentation.

## Documentation

- [Backend Documentation](./Backend/README.md)
- [Frontend Architecture](./Docs/Frontend.md)
- [API Reference](./Docs/API.md)

## License

ISC
