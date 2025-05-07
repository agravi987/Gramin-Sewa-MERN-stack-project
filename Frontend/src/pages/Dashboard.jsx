// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser, logout } from "../utils/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredEquipment, setFeaturedEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = getLoggedInUser();
      const token = localStorage.getItem("token");

      if (!userData || !token) {
        navigate("/login");
        return;
      }

      setUser(userData);

      try {
        const equipmentRes = await fetch("http://localhost:5000/api/equipment");
        const equipmentData = await equipmentRes.json();
        setEquipments(equipmentData);
        setFeaturedEquipment(equipmentData.slice(0, 4)); // Show only 4 featured items

        const bookingRes = await fetch("http://localhost:5000/api/booking/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingData = await bookingRes.json();
        setBookings(bookingData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleBooking = (equipmentId) => {
    navigate(`/book?equipment=${equipmentId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Gramin Sewa</h1>
            <p className="text-xl mb-8">
              Rent high-quality farming equipment at affordable prices
            </p>
            <button
              onClick={() => navigate("/book")}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition duration-300"
            >
              Book Equipment Now
            </button>
          </div>
        </section>

        {/* Featured Equipment */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Equipment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEquipment.map((eq) => (
                <div
                  key={eq._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {eq.imageUrl ? (
                      <img
                        src={eq.imageUrl}
                        alt={eq.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-20 w-20 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{eq.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {eq.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">
                        ₹{eq.pricePerHour}/hr
                      </span>
                      <button
                        onClick={() => handleBooking(eq._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/equipment")}
                className="text-green-600 font-semibold hover:underline"
              >
                View All Equipment →
              </button>
            </div>
          </div>
        </section>

        {/* My Bookings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't made any bookings yet.
                </p>
                <button
                  onClick={() => navigate("/book")}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Book Your First Equipment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">Equipment</th>
                      <th className="py-3 px-4 text-left">Booking Date</th>
                      <th className="py-3 px-4 text-left">From</th>
                      <th className="py-3 px-4 text-left">To</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((bk) => (
                      <tr key={bk._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          {bk.equipment?.name || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(bk.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(bk.fromDate).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(bk.toDate).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
