const express = require("express");
const router = express.Router();

const {
  getActoresByFilm,
  getFilmsByActor,
  addActoresToFilm,
  removeActorFromFilm,
  removeAllActoresFromFilm,
  syncActoresFilm,
} = require("../controllers/actorFilmController");

// ── Desde el lado de la película ──────────────────────────
// GET    /api/films/:filmId/actores
// POST   /api/films/:filmId/actores
// PUT    /api/films/:filmId/actores
// DELETE /api/films/:filmId/actores
// DELETE /api/films/:filmId/actores/:actorId

router.get("/films/:filmId/actores", getActoresByFilm);
router.post("/films/:filmId/actores", addActoresToFilm);
router.put("/films/:filmId/actores", syncActoresFilm);
router.delete("/films/:filmId/actores", removeAllActoresFromFilm);
router.delete("/films/:filmId/actores/:actorId", removeActorFromFilm);

// ── Desde el lado del actor ───────────────────────────────
// GET /api/actores/:actorId/films

router.get("/actores/:actorId/films", getFilmsByActor);

module.exports = router;