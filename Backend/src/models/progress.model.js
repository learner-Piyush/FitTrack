import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    bmi: {
      type: Number,
      min: 10,
      max: 60,
    },
    bodyFat: {
      type: Number,
      min: 2,
      max: 75,
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.pre("save", async function (next) {
  if (!this.isModified("bmi")) {
    const User = mongoose.model("User");
    const user = await User.findById(this.userId);

    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;

      if (heightInMeters > 0) {
        this.bmi = +(user.weight / (heightInMeters * heightInMeters)).toFixed(2);
      }
    }
  }
  next();
});

progressSchema.methods.calculateBMI = function (weight, heightCm) {
  if (!weight || !heightCm) return null;

  const heightInMeters = heightCm / 100;

  return +(weight / (heightInMeters * heightInMeters)).toFixed(2);
};

export const Progress = mongoose.model("Progress", progressSchema);
