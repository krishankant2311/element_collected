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
} = require("../controllers/userController");
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

module.exports = router;
