const express = require("express");
const router = express.Router();

const {
  getActores,
  getActor,
  searchActores,
  getActoresByFilm,
} = require("../controllers/actoresController");

router.get("/", getActores);
router.get("/buscar", searchActores);
router.get("/film/:filmId", getActoresByFilm);
router.get("/:id", getActor);

module.exports = router;