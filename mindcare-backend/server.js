const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ CORS imported
const journalRoutes = require("./routes/journalRoutes");

dotenv.config();

const app = express();

// ✅ Enable CORS (fixes "Failed to fetch" error)
app.use(cors());

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Use journal routes
app.use("/api/journals", journalRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
