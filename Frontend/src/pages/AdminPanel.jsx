import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getLoggedInUser } from "../utils/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("equipment");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = getToken();
  const user = getLoggedInUser();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingRes, userRes, equipRes] = await Promise.all([
        axios.get("http://localhost:5000/api/booking/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/equipment", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBookings(bookingRes.data);
      setUsers(userRes.data);
      setEquipments(equipRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageUrl("");
    setEditingId(null);
    setIsEditing(false);
  };

  const handleAddEquipment = async () => {
    if (!name || !price || !category) {
      setError(
        "Please fill in all required fields (Name, Category, and Price)"
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/equipment",
        {
          name,
          category,
          pricePerHour: price,
          description,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      resetForm();
      setError("");
      fetchData();
      setSuccessMessage("Equipment added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Error adding equipment", err);
      setError(err.response?.data?.message || "Error adding equipment");
    }
  };

  const handleUpdateEquipment = async () => {
    if (!name || !price || !category) {
      setError(
        "Please fill in all required fields (Name, Category, and Price)"
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/equipment/${editingId}`,
        {
          name,
          category,
          pricePerHour: price,
          description,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      resetForm();
      setError("");
      fetchData();
      setSuccessMessage("Equipment updated successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Error updating equipment", err);
      setError(err.response?.data?.message || "Error updating equipment");
    }
  };

  const handleEditEquipment = (equipment) => {
    setName(equipment.name);
    setCategory(equipment.category);
    setPrice(equipment.pricePerHour);
    setDescription(equipment.description);
    setImageUrl(equipment.imageUrl);
    setEditingId(equipment._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setSuccessMessage("Equipment deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Error deleting equipment", err);
      setError("Error deleting equipment");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="text-red-500 text-5xl mb-4">⛔</div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Return to Home
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Logged in as: <span className="font-semibold">{user.name}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                <p>{successMessage}</p>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => {
                    setActiveTab("equipment");
                    resetForm();
                  }}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "equipment"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Equipment Management
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "bookings"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "users"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Management
                </button>
              </nav>
            </div>

            {/* Equipment Management Tab */}
            {activeTab === "equipment" && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Edit Equipment" : "Manage Equipment"}
                </h2>

                {/* Add/Edit Equipment Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {isEditing ? "Edit Equipment" : "Add New Equipment"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipment Name*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter equipment name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    {/* Category Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter equipment category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    {/* Price Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Hour (₹)*
                      </label>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    {/* Optional: Description Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Optional: Image URL Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="md:col-span-2 flex justify-end space-x-3">
                      {isEditing && (
                        <button
                          onClick={resetForm}
                          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={
                          isEditing ? handleUpdateEquipment : handleAddEquipment
                        }
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        {isEditing ? "Update Equipment" : "Add Equipment"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Equipment List */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price (₹/hr)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {equipments.map((eq) => (
                        <tr key={eq._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {eq.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {eq.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{eq.pricePerHour}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditEquipment(eq)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEquipment(eq._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No bookings found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div
                        key={b._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              User
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                              {b.user?.name || "N/A"} ({b.user?.phone || "N/A"})
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Equipment
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                              {b.equipment?.name || "N/A"} (₹
                              {b.equipment?.pricePerHour || "N/A"}/hr)
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Total
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                              ₹{b.totalPrice || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              From
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(b.fromDate).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              To
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(b.toDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {u.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {u.phone}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
