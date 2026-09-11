const express = require("express");
const router = express.Router();

const {
  getComments,
  getComment,
  getUserComments,
  getFilmComments,
  createComment,
  editComment,
  deleteComment,
} = require("../controllers/comentariosController");

router.get("/", getComments);
router.get("/user/:usuario", getUserComments);
router.get("/film/:pelicula", getFilmComments);
router.get("/:id", getComment);
router.post("/", createComment);
router.put("/:id", editComment);
router.delete("/:id", deleteComment);

module.exports = router;