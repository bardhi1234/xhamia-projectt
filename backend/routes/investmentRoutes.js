const express = require("express");
const router = express.Router();

const controller = require("../controllers/investmentController");
const upload = require("../middleware/upload");

// ================= GET ALL =================
router.get("/", controller.getAll);

// ================= CREATE (MULTIPLE IMAGES) =================
router.post(
  "/",
  upload.array("images", 30),
  controller.create
);

// ================= UPDATE (MULTIPLE IMAGES OPTIONAL) =================
router.put(
  "/:id",
  upload.array("images", 30),
  controller.update
);

// ================= DELETE =================
router.delete("/:id", controller.remove);

module.exports = router;