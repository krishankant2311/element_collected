const bcrypt = require("bcryptjs");
const { User } = require("../models/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../middleware/jwt");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone, acceptTerms } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password || !phone?.trim()) {
      return sendResponse(res, 400, false, "Full name, email, phone and password are required");
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, "Passwords do not match");
    }

    if (!acceptTerms) {
      return sendResponse(res, 400, false, "Please accept Terms & Conditions");
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, "Password must be at least 6 characters");
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return sendResponse(res, 409, false, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    return sendResponse(res, 201, true, "Registration successful", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      status: "Active",
    }).select("+password");

    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    if (user.status === "Blocked") {
      return sendResponse(res, 403, false, "Your account has been blocked");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const payload = { id: user._id, email: user.email, role: "user" };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.accesstoken = accessToken;
    user.refreshtoken = refreshToken;
    await user.save();

    return sendResponse(res, 200, true, "Login successful", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getProfile = async (req, res) => {
  try {
    if (req.token.role !== "user") {
      return sendResponse(res, 403, false, "Access denied");
    }

    const user = await User.findById(req.token.id).select("-password");

    if (!user || user.status !== "Active") {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "Profile fetched", { user });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 400, false, "Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || decoded.role !== "user") {
      return sendResponse(res, 401, false, "Invalid or expired refresh token");
    }

    const user = await User.findOne({
      _id: decoded.id,
      refreshtoken: refreshToken,
      status: "Active",
    });

    if (!user) {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    const payload = { id: user._id, email: user.email, role: "user" };
    const accessToken = generateAccessToken(payload);

    user.accesstoken = accessToken;
    await user.save();

    return sendResponse(res, 200, true, "Token refreshed", { accessToken });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const logout = async (req, res) => {
  try {
    if (req.token.role !== "user") {
      return sendResponse(res, 403, false, "Access denied");
    }

    await User.findByIdAndUpdate(req.token.id, {
      accesstoken: "",
      refreshtoken: "",
    });

    return sendResponse(res, 200, true, "Logged out successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = { register, login, getProfile, refreshAccessToken, logout };

