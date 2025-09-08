import { Progress } from "../models/progress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

const addProgress = asyncHandler(async (req, res) => {
  const { date, bodyFat } = req.body || {};
  const user = req.user;

  if (!user.height || !user.weight)
    throw new ApiError(
      400,
      "Please update your profile with height and weight first.",
    );

  const progress = await Progress.create({
    userId: user._id,
    date,
    bodyFat,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, progress, "Progress added successfully"));
});

const getProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.find({ userId: req.user._id }).sort({
    date: 1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, progress, "Progress fetched successfully"));
});

const updateProgress = asyncHandler(async (req, res) => {
  const { progressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(progressId))
    throw new ApiError(400, "Invalid progress ID format");

  const { date, bmi, bodyFat } = req.body || {};

  if (!(date || bmi || bodyFat)) {
    const User = mongoose.model("User");
    const user = await User.findById(req.user._id);

    if (!user?.height || !user?.weight)
      throw new ApiError(
        400,
        "Please update profile with height and weight first",
      );

    const heightInMeters = user.height / 100;
    const newBmi = +(user.weight / (heightInMeters * heightInMeters)).toFixed(
      2,
    );

    const progress = await Progress.findOneAndUpdate(
      {
        _id: progressId,
        userId: req.user._id,
      },
      {
        $set: {
          bmi: newBmi,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          progress,
          "Progress BMI recalculated successfully",
        ),
      );
  }

  const progress = await Progress.findOneAndUpdate(
    {
      _id: progressId,
      userId: req.user._id,
    },
    {
      $set: {
        date,
        bmi,
        bodyFat,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!progress)
    throw new ApiError(404, "Progress not found or not authorized to update");

  return res
    .status(200)
    .json(new ApiResponse(200, progress, "Progress updated successfully"));
});

const deleteProgress = asyncHandler(async (req, res) => {
  const { progressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(progressId))
    throw new ApiError(400, "Invalid progress ID format");

  const progress = await Progress.findOneAndDelete({
    _id: progressId,
    userId: req.user._id,
  });

  if (!progress)
    throw new ApiError(404, "Progress not found or not authorized to delete");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Progress deleted successfully"));
});

export { addProgress, getProgress, updateProgress, deleteProgress };
