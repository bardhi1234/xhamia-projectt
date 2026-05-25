const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM investments ORDER BY id DESC"
    );

    return res.json(result.rows);
  } catch (err) {
    console.log("GET ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { type, stage } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        try {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: "xhamia-investments",
          });

          // safe delete (mos e crash Render)
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          return upload.secure_url;
        } catch (err) {
          console.log("Cloudinary upload error:", err.message);
          return null;
        }
      })
    );

    const cleanImages = uploadedImages.filter(Boolean);

    if (cleanImages.length === 0) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const result = await db.query(
      `
      INSERT INTO investments (images, type, stage)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [cleanImages, type, stage]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, stage } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            const upload = await cloudinary.uploader.upload(file.path, {
              folder: "xhamia-investments",
            });

            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }

            return upload.secure_url;
          } catch (err) {
            console.log("Cloudinary update error:", err.message);
            return null;
          }
        })
      );

      images = uploadedImages.filter(Boolean);
    } else {
      const existing = await db.query(
        "SELECT images FROM investments WHERE id=$1",
        [id]
      );

      images = existing.rows[0]?.images || [];
    }

    const result = await db.query(
      `
      UPDATE investments
      SET images=$1,
          type=$2,
          stage=$3
      WHERE id=$4
      RETURNING *
      `,
      [images, type, stage, id]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM investments WHERE id=$1", [id]);

    return res.json({ message: "Deleted Successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};