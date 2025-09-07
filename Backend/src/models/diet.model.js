import mongoose, { Schema } from "mongoose";

const dietSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    foodItems: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        calories: {
          type: Number,
          required: true,
          min: 0,
        },
        protein: {
          type: Number,
          default: 0,
          min: 0,
        },
        carbs: {
          type: Number,
          default: 0,
          min: 0,
        },
        fat: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    totalCalories: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

dietSchema.pre("save", function (next) {
  if (this.foodItems && this.foodItems.length > 0) {
    const totals = this.foodItems.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    this.totalCalories = totals.calories;
    this.totalProtein = totals.protein;
    this.totalCarbs = totals.carbs;
    this.totalFat = totals.fat;
  } else {
    this.totalCalories = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;
  }
  next();
});

export const Diet = mongoose.model("Diet", dietSchema);
