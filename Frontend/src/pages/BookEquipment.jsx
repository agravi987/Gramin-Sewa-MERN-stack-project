// src/pages/BookEquipment.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken, getLoggedInUser } from "../utils/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BookEquipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [step, setStep] = useState(1);

  const token = getToken();
  const user = getLoggedInUser();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const equipmentId = query.get("equipment");

    const fetchEquipment = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/equipment");
        setEquipmentList(res.data);

        if (equipmentId) {
          const eq = res.data.find((e) => e._id === equipmentId);
          if (eq) {
            setSelected(eq);
            setStep(2);
          }
        }
      } catch (err) {
        console.error(err);
        setMessage({ text: "Failed to load equipment", type: "error" });
      }
    };

    fetchEquipment();
  }, [location.search]);

  const handleBooking = async () => {
    if (!selected || !fromDate || !toDate) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/booking",
        {
          equipmentId: selected._id,
          fromDate,
          toDate,
          userId: user?.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        text: "Booking successful! Redirecting to dashboard...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Booking failed",
        type: "error",
      });
    }
  };

  const calculateTotal = () => {
    if (!fromDate || !toDate || !selected) return 0;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const hours = Math.ceil((to - from) / (1000 * 60 * 60));
    return hours * selected.pricePerHour;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Book Equipment
            </h1>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {step > 1 ? (
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span>1</span>
                    )}
                  </div>
                  <span className="mt-2 text-sm">Select Equipment</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {step > 2 ? (
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <span className="mt-2 text-sm">Choose Dates</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 3 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <span>3</span>
                  </div>
                  <span className="mt-2 text-sm">Confirmation</span>
                </div>
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className={`h-1 bg-green-500 transition-all duration-300 ease-in-out`}
                    style={{
                      width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Step 1: Select Equipment */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipmentList.map((eq) => (
                    <div
                      key={eq._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selected?._id === eq._id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => setSelected(eq)}
                    >
                      <div className="flex items-start">
                        <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex-shrink-0 flex items-center justify-center">
                          {eq.imageUrl ? (
                            <img
                              src={eq.imageUrl}
                              alt={eq.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold">{eq.name}</h3>
                          <p className="text-sm text-gray-600">{eq.category}</p>
                          <p className="text-green-600 font-semibold">
                            ₹{eq.pricePerHour}/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => selected && setStep(2)}
                    disabled={!selected}
                    className={`px-6 py-2 rounded-lg ${
                      selected
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Choose Dates */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Choose Booking Dates
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex-shrink-0 flex items-center justify-center">
                      {selected.imageUrl ? (
                        <img
                          src={selected.imageUrl}
                          alt={selected.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{selected.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selected.category}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ₹{selected.pricePerHour}/hr
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      min={fromDate || new Date().toISOString().slice(0, 16)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {fromDate && toDate && (
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Booking Summary</h3>
                    <div className="flex justify-between mb-1">
                      <span>Equipment:</span>
                      <span>{selected.name}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>From:</span>
                      <span>{new Date(fromDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>To:</span>
                      <span>{new Date(toDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                )}

                {message.text && (
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      message.type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!fromDate || !toDate}
                    className={`px-6 py-2 rounded-lg ${
                      fromDate && toDate
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation (handled via message and redirect) */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookEquipment;
