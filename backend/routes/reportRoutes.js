const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// GET
router.get("/", reportController.getAll);

// CREATE
router.post("/", reportController.create);

// DELETE
router.delete("/:id", reportController.remove);

module.exports = router;