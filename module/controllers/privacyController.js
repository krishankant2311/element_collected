const { Privacy } = require("../models/privacyModel");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

const getActivePrivacy = async () => {
  return Privacy.findOne({ status: "Active" }).sort({ updatedAt: -1 });
};

// User
const getUserPrivacy = async (req, res) => {
  try {
    const privacy = await getActivePrivacy();

    if (!privacy) {
      return sendResponse(res, 404, false, "Privacy Policy not found");
    }

    return sendResponse(res, 200, true, "Privacy Policy fetched", { privacy });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Admin
const getAdminPrivacy = async (req, res) => {
  try {
    const privacy = await getActivePrivacy();

    if (!privacy) {
      return sendResponse(res, 404, false, "Privacy Policy not found");
    }

    return sendResponse(res, 200, true, "Privacy Policy fetched", { privacy });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const savePrivacy = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content?.trim()) {
      return sendResponse(res, 400, false, "Content is required");
    }

    let privacy = await getActivePrivacy();
    let isNew = false;

    if (privacy) {
      privacy.title = title?.trim() || "Privacy Policy";
      privacy.content = content.trim();
      privacy.status = "Active";
      await privacy.save();
    } else {
      isNew = true;
      privacy = await Privacy.create({
        title: title?.trim() || "Privacy Policy",
        content: content.trim(),
      });
    }

    await Privacy.updateMany(
      { _id: { $ne: privacy._id }, status: "Active" },
      { status: "Deleted" }
    );

    if (isNew) {
      return sendResponse(res, 201, true, "Privacy Policy created", { privacy });
    }

    return sendResponse(res, 200, true, "Privacy Policy updated", { privacy });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getUserPrivacy,
  getAdminPrivacy,
  savePrivacy,
};
