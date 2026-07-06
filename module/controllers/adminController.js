const bcrypt = require("bcryptjs");
const { Admin } = require("../models/adminModel");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../middleware/jwt");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
      status: "Active",
    }).select("+password");

    if (!admin) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const payload = { id: admin._id, email: admin.email, role: "admin" };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    admin.accesstoken = accessToken;
    admin.refreshtoken = refreshToken;
    await admin.save();

    return sendResponse(res, 200, true, "Login successful", {
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
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
    if (req.token.role !== "admin") {
      return sendResponse(res, 403, false, "Access denied");
    }

    const admin = await Admin.findById(req.token.id).select("-password");

    if (!admin || admin.status !== "Active") {
      return sendResponse(res, 404, false, "Admin not found");
    }

    return sendResponse(res, 200, true, "Profile fetched", { admin });
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
    if (!decoded || decoded.role !== "admin") {
      return sendResponse(res, 401, false, "Invalid or expired refresh token");
    }

    const admin = await Admin.findOne({
      _id: decoded.id,
      refreshtoken: refreshToken,
      status: "Active",
    });

    if (!admin) {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    const payload = { id: admin._id, email: admin.email, role: "admin" };
    const accessToken = generateAccessToken(payload);

    admin.accesstoken = accessToken;
    await admin.save();

    return sendResponse(res, 200, true, "Token refreshed", { accessToken });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const logout = async (req, res) => {
  try {
    if (req.token.role !== "admin") {
      return sendResponse(res, 403, false, "Access denied");
    }

    await Admin.findByIdAndUpdate(req.token.id, {
      accesstoken: "",
      refreshtoken: "",
    });

    return sendResponse(res, 200, true, "Logged out successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = { login, getProfile, refreshAccessToken, logout };
