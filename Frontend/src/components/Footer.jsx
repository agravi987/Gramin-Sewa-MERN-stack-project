// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Gramin Sewa</h3>
            <p className="text-gray-400">
              Empowering farmers with easy access to agricultural equipment.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/equipment" className="text-gray-400 hover:text-white">
                  Equipment
                </a>
              </li>
              <li>
                <a href="/book" className="text-gray-400 hover:text-white">
                  Book Now
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: info@graminsewa.com</p>
            <p className="text-gray-400">Phone: +91 9876543210</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Gramin Sewa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
