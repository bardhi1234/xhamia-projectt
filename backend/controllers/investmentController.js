const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM investments ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { type, stage } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // upload all images to cloudinary
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "xhamia-investments",
        });

        fs.unlinkSync(file.path);
        return upload.secure_url;
      })
    );

    // save into DB (TEXT[])
    const result = await db.query(
      `
      INSERT INTO investments (images, type, stage)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [uploadedImages, type, stage]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Create Error" });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, stage } = req.body;

    // IF NEW IMAGES
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: "xhamia-investments",
          });

          fs.unlinkSync(file.path);
          return upload.secure_url;
        })
      );

      const result = await db.query(
        `
        UPDATE investments
        SET images=$1,
            type=$2,
            stage=$3
        WHERE id=$4
        RETURNING *
        `,
        [uploadedImages, type, stage, id]
      );

      return res.json(result.rows[0]);
    }

    // IF NO NEW IMAGES → KEEP OLD IMAGES
    const existing = await db.query(
      "SELECT images FROM investments WHERE id=$1",
      [id]
    );

    const result = await db.query(
      `
      UPDATE investments
      SET images=$1,
          type=$2,
          stage=$3
      WHERE id=$4
      RETURNING *
      `,
      [
        existing.rows[0].images,
        type,
        stage,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update Error" });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM investments WHERE id=$1", [id]);

    res.json({ message: "Deleted Successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete Error" });
  }
};