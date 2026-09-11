const express = require("express");
const router = express.Router();

const {
  getCalificaciones,
  getCalificacion,
  getCalificacionFilm,
  createCalificacion,
  editCalificacion,
  deleteCalificacion,
} = require("../controllers/calificacionesController");

router.get("/", getCalificaciones);
router.get("/film/:pelicula", getCalificacionFilm);
router.get("/:pelicula/:usuario", getCalificacion);
router.post("/", createCalificacion);
router.put("/:pelicula/:usuario", editCalificacion);
router.delete("/:pelicula/:usuario", deleteCalificacion);

module.exports = router;