const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  getMovies,
  getMovie,
  createMovie,
  editMovie,
  deleteMovie,
  filterMovies,
  uploadMovieMedia,
  getMovieMedia,
  deleteMovieMediaItem,
  getMovieActors,
} = require("../controllers/filmsController");

// ─── Multer field config ─────────────────────────────────────

const mediaUpload = upload.fields([
  { name: "portada", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
  { name: "files", maxCount: 20 },
]);

// ─── Routes ─────────────────────────────────────────────────

router.get("/filter", filterMovies);
router.get("/", getMovies);

router.get("/:id/actores", getMovieActors);
router.get("/:id/media", getMovieMedia);
router.post("/:id/upload", mediaUpload, uploadMovieMedia);
router.delete("/:id/media/:mediaId", deleteMovieMediaItem);

router.get("/:id", getMovie);
router.post("/", mediaUpload, createMovie);
router.put("/:id", mediaUpload, editMovie);
router.delete("/:id", deleteMovie);

module.exports = router;