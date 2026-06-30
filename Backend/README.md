# FitTrack Backend

A RESTful API backend for the FitTrack fitness tracking application built with Node.js, Express, and MongoDB.

## Tech Stack

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer + Mailgen** - Email services

## API Endpoints

### Health Check
- `GET /api/v1/healthcheck` - Server health status

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user (auth required)
- `GET /api/v1/auth/current-user` - Get current user (auth required)
- `PATCH /api/v1/auth/update-account` - Update account details (auth required)
- `PATCH /api/v1/auth/avatar` - Update user avatar (auth required)
- `POST /api/v1/auth/change-password` - Change password (auth required)
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/resend-email-verification` - Resend verification (auth required)
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `DELETE /api/v1/auth/delete-account` - Delete account (auth required)

### Workouts
- `GET /api/v1/workout` - Get all workouts (auth required)
- `POST /api/v1/workout` - Create workout (auth required)
- `GET /api/v1/workout/:workoutId` - Get workout by ID (auth required)
- `PATCH /api/v1/workout/:workoutId` - Update workout (auth required)
- `DELETE /api/v1/workout/:workoutId` - Delete workout (auth required)

### Diet
- `GET /api/v1/diet` - Get all diet logs (auth required)
- `POST /api/v1/diet` - Create diet log (auth required)
- `GET /api/v1/diet/:dietId` - Get diet log by ID (auth required)
- `PATCH /api/v1/diet/:dietId` - Update diet log (auth required)
- `DELETE /api/v1/diet/:dietId` - Delete diet log (auth required)

### Progress
- `GET /api/v1/progress` - Get all progress entries (auth required)
- `POST /api/v1/progress` - Add progress entry (auth required)
- `PATCH /api/v1/progress/:progressId` - Update progress (auth required)
- `DELETE /api/v1/progress/:progressId` - Delete progress (auth required)

## Environment Variables

Create a `.env` file in the Backend directory:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/fittrack

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIREY=1d
REFRESH_TOKEN_EXPIREY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Mailtrap (Email)
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your-user
MAILTRAP_SMTP_PASS=your-password

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js               # Entry point
├── db/
│   └── index.js           # MongoDB connection
├── controllers/
│   ├── auth.controller.js
│   ├── workout.controller.js
│   ├── diet.controller.js
│   └── progress.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── validator.middleware.js
├── models/
│   ├── user.model.js
│   ├── workout.model.js
│   ├── diet.model.js
│   └── progress.model.js
├── routes/
│   ├── auth.route.js
│   ├── workout.route.js
│   ├── diet.route.js
│   ├── progress.route.js
│   └── healthcheck.route.js
├── utils/
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   └── mail.js
└── validators/
    └── index.js           # Express-validator rules
```

## Data Models

### User
- username, email, password, fullName
- avatar (Cloudinary)
- height, weight, age, gender
- isEmailVerified
- refresh/forgot password tokens

### Workout
- userId, date, type, duration
- caloriesBurned, notes

### Diet
- userId, date, mealType
- foodItems[] with name, calories, protein, carbs, fat
- Auto-calculated totals

### Progress
- userId, date, bmi, bodyFat
- Auto-calculated BMI from user height/weight
