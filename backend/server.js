const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const investmentRoutes = require("./routes/investmentRoutes");
const donorRoutes = require("./routes/donorRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ================= SIMPLE + SAFE CORS =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://raportixhamis.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= HANDLE PREFLIGHT (SAFE) =================
app.options(/.*/, (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://raportixhamis.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/investments", investmentRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/reports", reportRoutes);

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API Running..." });
});

// ================= DB CHECK =================
db.query("SELECT NOW()")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("DB ERROR:", err.message));

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});