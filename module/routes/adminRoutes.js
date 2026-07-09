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
  getAdminTermsById,
  createTerms,
  updateTerms,
  deleteTerms,
} = require("../controllers/termsController");
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
router.get("/terms/:termsId", ...adminAuth, getAdminTermsById);
router.post("/terms", ...adminAuth, createTerms);
router.post("/terms/:termsId", ...adminAuth, updateTerms);
router.delete("/terms/:termsId", ...adminAuth, deleteTerms);

module.exports = router;