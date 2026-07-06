const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Active", "Deleted"],
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

const Admin = mongoose.model("Admin", adminSchema);

const createDefaultAdmin = async () => {
  try {
    const email = "krishankant@jewarinternational.com";
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const enc_password = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      fullName: "Krishankant",
      email,
      password: enc_password,
    });

    console.log("Default admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
};

module.exports = { Admin, createDefaultAdmin };
