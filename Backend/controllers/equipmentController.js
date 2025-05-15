const Equipment = require("../models/Equipment");

// Add new Equipment (Admin only)
exports.addEquipment = async (req, res) => {
  try {
    const { name, description, category, pricePerHour, imageUrl } = req.body;

    const newEquipment = new Equipment({
      name,
      description,
      category,
      pricePerHour,
      imageUrl,
    });
    await newEquipment.save();

    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Equipments
exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Equipment
exports.updateEquipment = async (req, res) => {
  try {
    const { name, description, category, pricePerHour, imageUrl } = req.body;

    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    equipment.name = name || equipment.name;
    equipment.description = description || equipment.description;
    equipment.category = category || equipment.category;
    equipment.pricePerHour = pricePerHour || equipment.pricePerHour;
    equipment.imageUrl = imageUrl || equipment.imageUrl;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json({ message: "Equipment removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
