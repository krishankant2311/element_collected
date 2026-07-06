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

module.exports = router;