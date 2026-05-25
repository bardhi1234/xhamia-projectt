const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// ================= ROUTES =================
const investmentRoutes = require("./routes/investmentRoutes");
const donorRoutes = require("./routes/donorRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/investments", investmentRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/reports", reportRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ================= DB TEST =================
db.query("SELECT NOW()")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("DB ERROR:", err);
  });

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.log("SERVER ERROR:", err);

  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});