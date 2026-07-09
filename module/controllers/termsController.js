const { Terms } = require("../models/termsModel");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

const getActiveTerms = async () => {
  return Terms.findOne({ status: "Active" }).sort({ updatedAt: -1 });
};

// User
const getUserTerms = async (req, res) => {
  try {
    const terms = await getActiveTerms();

    if (!terms) {
      return sendResponse(res, 404, false, "Terms & Conditions not found");
    }

    return sendResponse(res, 200, true, "Terms & Conditions fetched", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Admin
const getAdminTerms = async (req, res) => {
  try {
    const terms = await getActiveTerms();

    if (!terms) {
      return sendResponse(res, 404, false, "Terms & Conditions not found");
    }

    return sendResponse(res, 200, true, "Terms & Conditions fetched", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const saveTerms = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content?.trim()) {
      return sendResponse(res, 400, false, "Content is required");
    }

    let terms = await getActiveTerms();
    let isNew = false;

    if (terms) {
      terms.title = title?.trim() || "Terms & Conditions";
      terms.content = content.trim();
      terms.status = "Active";
      await terms.save();
    } else {
      isNew = true;
      terms = await Terms.create({
        title: title?.trim() || "Terms & Conditions",
        content: content.trim(),
      });
    }

    await Terms.updateMany(
      { _id: { $ne: terms._id }, status: "Active" },
      { status: "Deleted" }
    );

    if (isNew) {
      return sendResponse(res, 201, true, "Terms & Conditions created", { terms });
    }

    return sendResponse(res, 200, true, "Terms & Conditions updated", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getUserTerms,
  getAdminTerms,
  saveTerms,
};
