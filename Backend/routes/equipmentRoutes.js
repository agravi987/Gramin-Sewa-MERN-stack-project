const express = require("express");
const router = express.Router();
const {
  addEquipment,
  getAllEquipments,
  getEquipmentById,
} = require("../controllers/equipmentController");
const { protect } = require("../middleware/authMiddleware"); // we'll create this shortly

// @route POST /api/equipment
router.post("/", protect, addEquipment); // Only logged-in user (admin) should ideally add

// @route GET /api/equipment
router.get("/", getAllEquipments);

// @route GET /api/equipment/:id
router.get("/:id", getEquipmentById);

module.exports = router;
