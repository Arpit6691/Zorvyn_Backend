const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private
router.get("/profile", protect, getProfile);

// Admin only
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;