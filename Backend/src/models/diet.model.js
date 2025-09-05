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
  },
  {
    timestamps: true,
  },
);

dietSchema.pre("save", function (next) {
  if (this.foodItems && this.foodItems.length > 0) {
    this.totalCalories = this.foodItems.reduce(
      (sum, item) => sum + (item.calories || 0),
      0,
    );
  } else {
    this.totalCalories = 0;
  }
  next();
});

export const Diet = mongoose.model("Diet", dietSchema);
