const express = require("express");
const router = express.Router();

const donorController = require("../controllers/donorController");

router.get("/", donorController.getAll);
router.post("/", donorController.create);
router.put("/:id", donorController.update);
router.delete("/:id", donorController.remove);

module.exports = router;