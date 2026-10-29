import mongoose from "mongoose";

const ambassadorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    referralCode: {
      type: String,
      unique: true,
      required: true,
    },

    totalClicks: {
      type: Number,
      default: 0,
    },

    totalRegistrations: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Ambassador = mongoose.model("Ambassador", ambassadorSchema);

export default Ambassador;