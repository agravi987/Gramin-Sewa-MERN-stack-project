const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    bookingDate: { type: Date, default: Date.now },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalHours: { type: Number },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
