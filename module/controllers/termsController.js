const mongoose = require("mongoose");
const { Terms } = require("../models/termsModel");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

// User
const getUserTerms = async (req, res) => {
  try {
    const termsList = await Terms.find({ status: "Active" }).sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Terms & Conditions fetched", {
      count: termsList.length,
      terms: termsList,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getUserTermsById = async (req, res) => {
  try {
    const { termsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(termsId)) {
      return sendResponse(res, 400, false, "Invalid terms id");
    }

    const terms = await Terms.findOne({ _id: termsId, status: "Active" });

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
    const { status } = req.query;
    const filter = status ? { status } : { status: { $ne: "Deleted" } };

    const termsList = await Terms.find(filter).sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Terms & Conditions fetched", {
      count: termsList.length,
      terms: termsList,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getAdminTermsById = async (req, res) => {
  try {
    const { termsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(termsId)) {
      return sendResponse(res, 400, false, "Invalid terms id");
    }

    const terms = await Terms.findById(termsId);

    if (!terms || terms.status === "Deleted") {
      return sendResponse(res, 404, false, "Terms & Conditions not found");
    }

    return sendResponse(res, 200, true, "Terms & Conditions fetched", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const createTerms = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content?.trim()) {
      return sendResponse(res, 400, false, "Content is required");
    }

    const terms = await Terms.create({
      title: title?.trim() || "Terms & Conditions",
      content: content.trim(),
    });

    return sendResponse(res, 201, true, "Terms & Conditions created", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const updateTerms = async (req, res) => {
  try {
    const { termsId } = req.params;
    const { title, content, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(termsId)) {
      return sendResponse(res, 400, false, "Invalid terms id");
    }

    const terms = await Terms.findById(termsId);

    if (!terms || terms.status === "Deleted") {
      return sendResponse(res, 404, false, "Terms & Conditions not found");
    }

    if (title?.trim()) terms.title = title.trim();
    if (content?.trim()) terms.content = content.trim();
    if (status) terms.status = status;

    await terms.save();

    return sendResponse(res, 200, true, "Terms & Conditions updated", { terms });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteTerms = async (req, res) => {
  try {
    const { termsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(termsId)) {
      return sendResponse(res, 400, false, "Invalid terms id");
    }

    const terms = await Terms.findById(termsId);

    if (!terms || terms.status === "Deleted") {
      return sendResponse(res, 404, false, "Terms & Conditions not found");
    }

    terms.status = "Deleted";
    await terms.save();

    return sendResponse(res, 200, true, "Terms & Conditions deleted");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getUserTerms,
  getUserTermsById,
  getAdminTerms,
  getAdminTermsById,
  createTerms,
  updateTerms,
  deleteTerms,
};
