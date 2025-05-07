const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// @route POST /api/booking
router.post("/", protect, createBooking);

// @route GET /api/booking/my
router.get("/my", protect, getMyBookings);

// @route GET /api/booking/all
router.get("/all", protect, isAdmin, getAllBookings);

module.exports = router;
