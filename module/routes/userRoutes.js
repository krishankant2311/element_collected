const express = require("express");
const {
  register,
  login,
  getProfile,
  refreshAccessToken,
  logout,
} = require("../controllers/userController");
const { verifyAccessToken } = require("../../middleware/jwt");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", verifyAccessToken, getProfile);
router.post("/logout", verifyAccessToken, logout);

module.exports = router;
