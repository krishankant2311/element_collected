const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
  getDarkMode,
  updateDarkMode,
} = require("../controllers/userController");
const { getUserFaqs, getUserFaqById } = require("../controllers/faqController");
const { getUserTerms } = require("../controllers/termsController");
const { getUserPrivacy } = require("../controllers/privacyController");
const { verifyAccessToken } = require("../../middleware/jwt");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", verifyAccessToken, getProfile);
router.post("/update-profile", verifyAccessToken, updateProfile);
router.post("/change-password", verifyAccessToken, changePassword);
router.post("/logout", verifyAccessToken, logout);

router.get("/dark-mode", verifyAccessToken, getDarkMode);
router.post("/dark-mode", verifyAccessToken, updateDarkMode);

router.get("/faq", getUserFaqs);
router.get("/faq/:faqId", getUserFaqById);
router.get("/terms", getUserTerms);
router.get("/privacy", getUserPrivacy);

module.exports = router;
