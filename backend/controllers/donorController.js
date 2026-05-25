const db = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM donors ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB error" });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const { name, description, amount } = req.body;

    // 🔥 VALIDATION
    if (!name || !description || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const result = await db.query(
      "INSERT INTO donors (name, description, amount) VALUES ($1,$2,$3) RETURNING *",
      [name, description, numericAmount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log("DONOR CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amount } = req.body;

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: "Amount must be number" });
    }

    const result = await db.query(
      "UPDATE donors SET name=$1, description=$2, amount=$3 WHERE id=$4 RETURNING *",
      [name, description, numericAmount, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM donors WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};