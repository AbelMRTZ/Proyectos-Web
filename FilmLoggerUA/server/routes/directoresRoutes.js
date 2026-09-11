const express = require("express");
const router = express.Router();

const {
  getDirectores,
  getDirector,
  searchDirectores,
} = require("../controllers/directoresController");

router.get("/", getDirectores);
router.get("/buscar", searchDirectores);
router.get("/:id", getDirector);

module.exports = router;