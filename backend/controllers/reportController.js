const db = require("../config/db");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM reports ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.log("GET REPORTS ERROR:", err);
    res.status(500).json(err.message);
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const {
      title,
      period,
      amount,
      date,
      description,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO reports
      (title, period, amount, date, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        title,
        period,
        amount,
        date,
        description,
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("CREATE REPORT ERROR:", err);
    res.status(500).json(err.message);
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      period,
      amount,
      date,
      description,
    } = req.body;

    const result = await db.query(
      `
      UPDATE reports
      SET title=$1,
          period=$2,
          amount=$3,
          date=$4,
          description=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        title,
        period,
        amount,
        date,
        description,
        id,
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("UPDATE REPORT ERROR:", err);
    res.status(500).json(err.message);
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM reports WHERE id=$1",
      [id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    console.log("DELETE REPORT ERROR:", err);
    res.status(500).json(err.message);
  }
};