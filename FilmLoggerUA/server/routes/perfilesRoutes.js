const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  getPerfiles,
  getPerfil,
  createPerfil,
  editPerfil,
  deletePerfil,
} = require("../controllers/perfilesController");

router.get("/", getPerfiles);
router.get("/:id", getPerfil);
router.post("/", createPerfil);

// Solo aplica multer cuando la petición es multipart (lleva foto)
const conditionalUpload = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return upload.fields([{ name: "foto_perfil", maxCount: 1 }])(req, res, next);
  }
  next();
};

router.put("/:id", conditionalUpload, editPerfil);

router.delete("/:id", deletePerfil);

module.exports = router;