const mongoose = require("mongoose");
const { Faq } = require("../models/faqModel");

const sendResponse = (res, statusCode, success, message, result = {}) => {
  return res.status(statusCode).json({ statusCode, success, message, result });
};

// User
const getUserFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ status: "Active" }).sort({ order: 1, createdAt: -1 });

    return sendResponse(res, 200, true, "FAQs fetched", {
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getUserFaqById = async (req, res) => {
  try {
    const { faqId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return sendResponse(res, 400, false, "Invalid FAQ id");
    }

    const faq = await Faq.findOne({ _id: faqId, status: "Active" });

    if (!faq) {
      return sendResponse(res, 404, false, "FAQ not found");
    }

    return sendResponse(res, 200, true, "FAQ fetched", { faq });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Admin
const getAdminFaqs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: { $ne: "Deleted" } };

    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 });

    return sendResponse(res, 200, true, "FAQs fetched", {
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getAdminFaqById = async (req, res) => {
  try {
    const { faqId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return sendResponse(res, 400, false, "Invalid FAQ id");
    }

    const faq = await Faq.findById(faqId);

    if (!faq || faq.status === "Deleted") {
      return sendResponse(res, 404, false, "FAQ not found");
    }

    return sendResponse(res, 200, true, "FAQ fetched", { faq });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const createFaq = async (req, res) => {
  try {
    const { question, answer, order } = req.body;

    if (!question?.trim() || !answer?.trim()) {
      return sendResponse(res, 400, false, "Question and answer are required");
    }

    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      order: order || 0,
    });

    return sendResponse(res, 201, true, "FAQ created", { faq });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const updateFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer, order, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return sendResponse(res, 400, false, "Invalid FAQ id");
    }

    const faq = await Faq.findById(faqId);

    if (!faq || faq.status === "Deleted") {
      return sendResponse(res, 404, false, "FAQ not found");
    }

    if (question?.trim()) faq.question = question.trim();
    if (answer?.trim()) faq.answer = answer.trim();
    if (order !== undefined) faq.order = order;
    if (status) faq.status = status;

    await faq.save();

    return sendResponse(res, 200, true, "FAQ updated", { faq });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { faqId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return sendResponse(res, 400, false, "Invalid FAQ id");
    }

    const faq = await Faq.findById(faqId);

    if (!faq || faq.status === "Deleted") {
      return sendResponse(res, 404, false, "FAQ not found");
    }

    faq.status = "Deleted";
    await faq.save();

    return sendResponse(res, 200, true, "FAQ deleted");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getUserFaqs,
  getUserFaqById,
  getAdminFaqs,
  getAdminFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
