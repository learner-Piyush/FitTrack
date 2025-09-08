import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// basic configuration
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// import the routes
import healthcheckRouter from './routes/healthcheck.route.js'
import authRouter from './routes/auth.route.js'
import workoutRouter from './routes/workout.route.js'
import dietRouter from './routes/diet.route.js'
import progressRouter from './routes/progress.route.js'

// routes
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/workout", workoutRouter)
app.use("/api/v1/diet", dietRouter)
app.use("/api/v1/progress", progressRouter)

app.get("/", (req, res) => {
  res.send("Welcome to FitTrack");
});

export default app;
