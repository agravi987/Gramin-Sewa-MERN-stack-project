// src/pages/EquipmentList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/equipment");
        const data = await response.json();
        setEquipments(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleBooking = (equipmentId) => {
    navigate(`/book?equipment=${equipmentId}`);
  };

  const filteredEquipment = equipments.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || eq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(equipments.map((eq) => eq.category))];

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

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Available Equipment
          </h1>

          {/* Search and Filter */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No equipment found matching your criteria.
                </p>
              </div>
            ) : (
              filteredEquipment.map((eq) => (
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
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                        {eq.category}
                      </span>
                      {eq.available ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Booked
                        </span>
                      )}
                    </div>
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
                        disabled={!eq.available}
                      >
                        {eq.available ? "Book Now" : "Not Available"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EquipmentList;
