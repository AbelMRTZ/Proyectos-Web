const express = require("express");
const router = express.Router();

const {
  getImagenes,
  getImagen,
  getImagenesFilm,
  createImagen,
  editImagen,
  deleteImagen,
} = require("../controllers/imagenesController");

router.get("/", getImagenes);
router.get("/film/:pelicula", getImagenesFilm);
router.get("/:id", getImagen);
router.post("/", createImagen);
router.put("/:id", editImagen);
router.delete("/:id", deleteImagen);

module.exports = router;