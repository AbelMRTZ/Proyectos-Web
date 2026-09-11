require("dotenv").config();
const express = require("express");
const cors = require("cors");
const filmsRoutes = require("./routes/filmsRoutes");
const perfilesRoutes = require("./routes/perfilesRoutes");
const comentariosRoutes = require("./routes/comentariosRoutes");
const calificacionRoutes = require("./routes/calificacionesRoutes");
const imagenesRoutes = require("./routes/imagenesRoutes");
const favoritasRoutes = require("./routes/favoritasRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const actoresRoutes = require("./routes/actoresRoutes");
const actorFilmRoutes = require("./routes/actorFilmRoutes");
const directoresRoutes = require("./routes/directoresRoutes");
const directorFilmRoutes = require("./routes/directorFilmRoutes");



const supabase = require("./supabase")
const app = express();

app.use(cors());
app.use(express.json());

// Ruta directa antes del subrouter para garantizar que se registra primero
app.get("/api/actores/film/:filmId", async (req, res) => {
  const { filmId } = req.params;

  const { data: relations, error: relError } = await supabase
    .from("Actor_Film")
    .select("actor_id, rol")
    .eq("film_id", filmId);

  if (relError) return res.status(500).json({ error: relError.message });
  if (!relations.length) return res.status(200).json([]);

  const actorIds = relations.map((r) => r.actor_id);
  const rolByActor = new Map(relations.map((r) => [r.actor_id, r.rol]));

  const { data: actores, error: actError } = await supabase
    .from("Actores")
    .select("id, nombre, foto_perfil")
    .in("id", actorIds);

  if (actError) return res.status(500).json({ error: actError.message });

  res.status(200).json(actores.map((a) => ({ ...a, rol: rolByActor.get(a.id) || null })));
});

app.use("/api/films", filmsRoutes);
app.use("/api/perfiles", perfilesRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/calificaciones", calificacionRoutes);
app.use("/api/imagenes", imagenesRoutes);
app.use("/api/favoritas", favoritasRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/actores", actoresRoutes);
app.use("/api/directores", directoresRoutes);
app.use("/api/actorFilm", actorFilmRoutes);
app.use("/api/directorFilm", directorFilmRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Server running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));