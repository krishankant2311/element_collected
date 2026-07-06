const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "Deleted"],
      default: "Active",
    },
    accesstoken: {
      type: String,
      default: "",
    },
    refreshtoken: {
      type: String,
      default: "",
    },
    otp: {
      otpValue: { type: String, default: "" },
      otpExpiry: { type: Date, default: null },
    },
    securityToken: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
