const express = require("express");
const router = express.Router();

const {
  getFavoritas,
  getFavorita,
  getFavoritasByUser,
  getFavoritasByFilm,
  createFavorita,
  deleteFavorita,
} = require("../controllers/favoritasController");

router.get("/", getFavoritas);
router.get("/user/:usuario", getFavoritasByUser);
router.get("/film/:pelicula", getFavoritasByFilm);
router.get("/:id", getFavorita);
router.post("/", createFavorita);
router.delete("/:usuario/:pelicula", deleteFavorita);

module.exports = router;