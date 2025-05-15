// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { getLoggedInUser, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-xl font-bold">Gramin Sewa</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className="hover:text-green-200 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/equipment"
            className="hover:text-green-200 transition duration-300"
          >
            View Equipment
          </Link>
          {user?.role === "farmer" && (
            <Link
              to="/book"
              className="hover:text-green-200 transition duration-300"
            >
              Book Equipment
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-green-200 transition duration-300"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-4 py-1 rounded hover:bg-green-100 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-green-700 px-4 py-1 rounded hover:bg-green-100 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
