const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // e.g., tractor, harvester, plough
    pricePerHour: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", EquipmentSchema);
