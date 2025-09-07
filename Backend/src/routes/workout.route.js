import { Router } from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createWorkout).get(getWorkouts);

router
  .route("/:workoutId")
  .get(getWorkoutById)
  .patch(updateWorkout)
  .delete(deleteWorkout);

export default router;
