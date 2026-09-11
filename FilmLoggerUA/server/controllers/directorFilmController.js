const supabase = require("../supabase");

// GET /api/films/:filmId/directores
const getDirectoresByFilm = async (req, res) => {
  const { filmId } = req.params;

  const { data, error } = await supabase
    .from("Director_Film")
    .select(`
      id,
      Directores (
        id,
        nombre,
        foto_perfil,
        fecha_nacimiento,
        nacionalidad
      )
    `)
    .eq("film_id", filmId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/directores/:directorId/films
const getFilmsByDirector = async (req, res) => {
  const { directorId } = req.params;

  const { data, error } = await supabase
    .from("Director_Film")
    .select(`
      id,
      Films (
        id,
        titulo,
        img_portada,
        fecha_publicacion,
        estado
      )
    `)
    .eq("director_id", directorId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/films/:filmId/directores
// Body: { director_id: number } o { directores: [{ director_id: number }] }
const addDirectoresToFilm = async (req, res) => {
  const { filmId } = req.params;
  const body = req.body;
  let rows = [];

  if (Array.isArray(body.directores)) {
    rows = body.directores.map((d) => ({
      film_id: Number(filmId),
      director_id: Number(d.director_id),
    }));
  } else if (body.director_id) {
    rows = [{ film_id: Number(filmId), director_id: Number(body.director_id) }];
  } else {
    return res.status(400).json({ error: "Se requiere director_id o un array de directores" });
  }

  const { data, error } = await supabase
    .from("Director_Film")
    .upsert(rows, { onConflict: "director_id,film_id", ignoreDuplicates: true })
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ inserted: data });
};

// DELETE /api/films/:filmId/directores/:directorId
const removeDirectorFromFilm = async (req, res) => {
  const { filmId, directorId } = req.params;

  const { error } = await supabase
    .from("Director_Film")
    .delete()
    .eq("film_id", filmId)
    .eq("director_id", directorId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Relación eliminada correctamente" });
};

// DELETE /api/films/:filmId/directores
const removeAllDirectoresFromFilm = async (req, res) => {
  const { filmId } = req.params;

  const { error } = await supabase
    .from("Director_Film")
    .delete()
    .eq("film_id", filmId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Todas las relaciones de directores eliminadas" });
};

// PUT /api/films/:filmId/directores
// Reemplaza todos los directores de una película de una sola vez
// Body: { directores: [{ director_id: number }] }
const syncDirectoresFilm = async (req, res) => {
  const { filmId } = req.params;
  const { directores } = req.body;

  if (!Array.isArray(directores)) {
    return res.status(400).json({ error: "directores debe ser un array" });
  }

  const { error: deleteError } = await supabase
    .from("Director_Film")
    .delete()
    .eq("film_id", filmId);

  if (deleteError) return res.status(500).json({ error: deleteError.message });

  if (directores.length === 0) {
    return res.json({ message: "Directores sincronizados (lista vacía)" });
  }

  const rows = directores.map((d) => ({
    film_id: Number(filmId),
    director_id: Number(d.director_id ?? d),
  }));

  const { data, error: insertError } = await supabase
    .from("Director_Film")
    .insert(rows)
    .select();

  if (insertError) return res.status(500).json({ error: insertError.message });
  res.json({ synced: data });
};

module.exports = {
  getDirectoresByFilm,
  getFilmsByDirector,
  addDirectoresToFilm,
  removeDirectorFromFilm,
  removeAllDirectoresFromFilm,
  syncDirectoresFilm,
};