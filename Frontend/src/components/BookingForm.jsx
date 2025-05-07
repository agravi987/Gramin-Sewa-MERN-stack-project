import { useState } from "react";
import { createBooking } from "../api";

const BookingForm = () => {
  const [equipmentId, setEquipmentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const bookingData = { equipmentId, fromDate, toDate };
    const response = await createBooking(bookingData, token);
    console.log(response);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-lg">
      <h1 className="text-xl font-semibold mb-4">Book Equipment</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Equipment ID"
          className="w-full p-2 border mb-4"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border mb-4"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border mb-4"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button type="submit" className="w-full bg-purple-700 text-white p-2">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
