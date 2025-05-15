const express = require("express");
const router = express.Router();
const {
  addEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipmentController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.post("/", protect, isAdmin, addEquipment);
router.get("/", getAllEquipments);
router.get("/:id", getEquipmentById);
router.put("/:id", protect, isAdmin, updateEquipment);
router.delete("/:id", protect, isAdmin, deleteEquipment);

module.exports = router;
