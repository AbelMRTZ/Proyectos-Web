const express = require("express");
const router = express.Router();

const {
  getDirectoresByFilm,
  getFilmsByDirector,
  addDirectoresToFilm,
  removeDirectorFromFilm,
  removeAllDirectoresFromFilm,
  syncDirectoresFilm,
} = require("../controllers/directorFilmController");

// ── Desde el lado de la película ──────────────────────────
router.get("/films/:filmId/directores", getDirectoresByFilm);
router.post("/films/:filmId/directores", addDirectoresToFilm);
router.put("/films/:filmId/directores", syncDirectoresFilm);
router.delete("/films/:filmId/directores", removeAllDirectoresFromFilm);
router.delete("/films/:filmId/directores/:directorId", removeDirectorFromFilm);

// ── Desde el lado del director ────────────────────────────
router.get("/directores/:directorId/films", getFilmsByDirector);

module.exports = router;