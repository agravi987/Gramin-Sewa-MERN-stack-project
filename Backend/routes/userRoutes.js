// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getMyProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// GET /api/users - Admin only
router.get("/", protect, isAdmin, getAllUsers);

// GET /api/users/me - Get own profile
router.get("/me", protect, getMyProfile);

// GET /api/users/:id - Admin or same user
router.get("/:id", protect, getUserById);

// DELETE /api/users/:id - Admin only
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
