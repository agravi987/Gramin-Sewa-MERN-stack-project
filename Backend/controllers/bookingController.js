const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { equipmentId, fromDate, toDate } = req.body;

    // Check if equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      equipment: equipmentId,
      $or: [
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate },
        },
      ],
    });

    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Equipment already booked for selected dates" });
    }

    // Calculate hours and total price
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const hours = Math.abs(to - from) / 36e5; // milliseconds to hours
    const totalPrice = hours * equipment.pricePerHour;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      equipment: equipmentId,
      fromDate,
      toDate,
      totalHours: hours,
      totalPrice,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings of logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "equipment"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("equipment");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
