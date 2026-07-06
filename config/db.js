require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error("MongoDB connection failed: MONGODB_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      // Corporate proxy/VPN SSL inspect karta hai — Node CA trust nahi karta
      tlsAllowInvalidCertificates:
        process.env.TLS_ALLOW_INVALID === "true",
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
