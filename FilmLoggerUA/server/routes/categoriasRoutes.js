const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categoriasController");

router.get("/", getCategories);

module.exports = router;