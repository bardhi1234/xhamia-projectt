const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// ================= ROUTES =================
const investmentRoutes = require("./routes/investmentRoutes");
const donorRoutes = require("./routes/donorRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://xhamia-project.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server / render health check

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api/investments", investmentRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/reports", reportRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

// ================= DB CHECK (NON-BLOCKING) =================
db.query("SELECT NOW()")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("DB ERROR:", err.message));

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});