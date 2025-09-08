import { Workout } from "../models/workout.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

const createWorkout = asyncHandler(async (req, res) => {
  const { type, duration, caloriesBurned, notes, date } = req.body;

  if (!type || !duration)
    throw new ApiError(400, "Type and duration are required");

  const workout = await Workout.create({
    userId: req.user._id,
    type,
    duration,
    caloriesBurned,
    notes,
    date,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workout, "Workout created successfully"));
});

const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ userId: req.user._id }).sort({
    date: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workouts, "Workouts fetched successfully"));
});

const getWorkoutById = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId))
    throw new ApiError(400, "Invalid workout ID format");

  const workout = await Workout.findOne({
    _id: workoutId,
    userId: req.user._id,
  });

  if (!workout) throw new ApiError(404, "Workout not found");

  return res
    .status(200)
    .json(new ApiResponse(200, workout, "Workout fetched successfully"));
});

const updateWorkout = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId))
    throw new ApiError(400, "Invalid workout ID format");

  const { type, duration, caloriesBurned, notes, date } = req.body;

  if (!(type || duration || caloriesBurned || notes || date))
    throw new ApiError(400, "At least 1 field is required to update");

  const workout = await Workout.findOneAndUpdate(
    {
      _id: workoutId,
      userId: req.user._id,
    },
    {
      $set: {
        type,
        duration,
        caloriesBurned,
        notes,
        date,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!workout)
    throw new ApiError(404, "Workout not found or not authorized to update");

  return res
    .status(200)
    .json(new ApiResponse(200, workout, "Workout updated successfully"));
});

const deleteWorkout = asyncHandler(async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId))
    throw new ApiError(400, "Invalid workout ID format");

  const workout = await Workout.findOneAndDelete({
    _id: workoutId,
    userId: req.user._id,
  });

  if (!workout)
    throw new ApiError(404, "Workout not found or not authorized to delete");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Workout deleted successfully"));
});

export {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};
