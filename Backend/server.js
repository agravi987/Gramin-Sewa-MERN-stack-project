const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// // Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
