import { Diet } from "../models/diet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

const createDietLog = asyncHandler(async (req, res) => {
  const { date, mealType, foodItems } = req.body;

  if (!mealType || !foodItems || foodItems.length === 0)
    throw new ApiError(
      400,
      "Meal type and at least one food item are required",
    );

  const dietLog = await Diet.create({
    userId: req.user._id,
    date,
    mealType,
    foodItems,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, dietLog, "Diet log created successfully"));
});

const getDietLogs = asyncHandler(async (req, res) => {
  const dietLogs = await Diet.find({ userId: req.user._id }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, dietLogs, "Diet logs fetched successfully"));
});

const getDietLogById = asyncHandler(async (req, res) => {
  const { dietId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dietId))
    throw new ApiError(400, "Invalid diet log ID format");

  const dietLog = await Diet.findOne({
    _id: dietId,
    userId: req.user._id,
  });

  if (!dietLog) throw new ApiError(404, "Diet log not found");

  return res
    .status(200)
    .json(new ApiResponse(200, dietLog, "Diet log fetched successfully"));
});

const updateDietLog = asyncHandler(async (req, res) => {
  const { dietId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dietId))
    throw new ApiError(400, "Invalid diet log ID format");

  const { date, mealType, foodItems } = req.body;

  if (!(date || mealType || (foodItems && foodItems.length > 0))) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const dietLog = await Diet.findOne({
    _id: dietId,
    userId: req.user._id,
  });

  if (!dietLog)
    throw new ApiError(404, "Diet log not found or not authorized to update");

  if (date) dietLog.date = date;
  if (mealType) dietLog.mealType = mealType;
  if (foodItems && foodItems.length > 0) dietLog.foodItems = foodItems;

  await dietLog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, dietLog, "Diet log updated successfully"));
});

const deleteDietLog = asyncHandler(async (req, res) => {
  const { dietId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dietId))
    throw new ApiError(400, "Invalid diet log ID format");

  const dietLog = await Diet.findOneAndDelete({
    _id: dietId,
    userId: req.user._id,
  });

  if (!dietLog)
    throw new ApiError(404, "Diet log not found or not authorized to delete");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Diet log deleted successfully"));
});

export {
  createDietLog,
  getDietLogs,
  getDietLogById,
  updateDietLog,
  deleteDietLog,
};
