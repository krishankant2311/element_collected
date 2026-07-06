const mongoose = require("mongoose");
const { User } = require("../models/userModel");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

const getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "Deleted" };
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Users fetched", {
      count: users.length,
      users,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, false, "Invalid user id");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User profile fetched", { user });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, false, "Invalid user id");
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.status === "Deleted") {
      return sendResponse(res, 400, false, "Cannot block a deleted user");
    }

    if (user.status === "Blocked") {
      return sendResponse(res, 400, false, "User is already blocked");
    }

    user.status = "Blocked";
    user.accesstoken = "";
    user.refreshtoken = "";
    await user.save();

    return sendResponse(res, 200, true, "User blocked successfully", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, false, "Invalid user id");
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.status === "Deleted") {
      return sendResponse(res, 400, false, "User is already deleted");
    }

    user.status = "Deleted";
    user.accesstoken = "";
    user.refreshtoken = "";
    await user.save();

    return sendResponse(res, 200, true, "User deleted successfully", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = { getAllUsers, getUserById, blockUser, deleteUser };
