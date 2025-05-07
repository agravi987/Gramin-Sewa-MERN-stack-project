import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 shadow-md">
        <div className="text-2xl font-bold text-white">Gramin Sewa 🚜</div>
        <div className="space-x-6">
          <Link to="/" className="text-white font-semibold hover:underline">
            Home
          </Link>
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white font-semibold hover:underline"
          >
            Signup
          </Link>
          <Link
            to="/admin"
            className="text-white font-semibold hover:underline"
          >
            Admin
          </Link>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-200 text-center p-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 animate-bounce">
          Welcome to Gramin Sewa 🚜
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-gray-600">
          Simplifying Farming Equipment Bookings For Every Farmer!
        </p>
        <Link to="/login">
          <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300">
            Get Started
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © {new Date().getFullYear()} Gramin Sewa. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
