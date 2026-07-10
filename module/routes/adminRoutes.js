const express = require("express");
const {
  login,
  getProfile,
  refreshAccessToken,
  logout,
} = require("../controllers/adminController");
const {
  getAllUsers,
  getUserById,
  blockUser,
  deleteUser,
} = require("../controllers/adminUserController");
const {
  getAdminFaqs,
  getAdminFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faqController");
const {
  getAdminTerms,
  saveTerms,
} = require("../controllers/termsController");
const {
  getAdminPrivacy,
  savePrivacy,
} = require("../controllers/privacyController");
const {
  verifyAccessToken,
  requireAdmin,
} = require("../../middleware/jwt");

const router = express.Router();
const adminAuth = [verifyAccessToken, requireAdmin];

router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", ...adminAuth, getProfile);
router.post("/logout", ...adminAuth, logout);

router.get("/users", ...adminAuth, getAllUsers);
router.get("/users/:userId", ...adminAuth, getUserById);
router.patch("/users/:userId/block", ...adminAuth, blockUser);
router.delete("/users/:userId", ...adminAuth, deleteUser);

router.get("/faq", ...adminAuth, getAdminFaqs);
router.get("/faq/:faqId", ...adminAuth, getAdminFaqById);
router.post("/faq", ...adminAuth, createFaq);
router.post("/faq/:faqId", ...adminAuth, updateFaq);
router.delete("/faq/:faqId", ...adminAuth, deleteFaq);

router.get("/terms", ...adminAuth, getAdminTerms);
router.post("/terms", ...adminAuth, saveTerms);

router.get("/privacy", ...adminAuth, getAdminPrivacy);
router.post("/privacy", ...adminAuth, savePrivacy);

module.exports = router;