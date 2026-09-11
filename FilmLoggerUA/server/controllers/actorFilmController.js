const supabase = require("../supabase");

// ─────────────────────────────────────────────
// GET /api/films/:filmId/actores
// Devuelve todos los actores de una película
// ─────────────────────────────────────────────

const getActoresByFilm = async (req, res) => {
  const { filmId } = req.params;

  const { data, error } = await supabase
    .from("Actor_Film")
    .select(`
      id,
      rol,
      Actores (
        id,
        nombre,
        foto_perfil,
        fecha_nacimiento,
        nacionalidad
      )
    `)
    .eq("film_id", filmId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// ─────────────────────────────────────────────
// GET /api/actores/:actorId/films
// Devuelve todas las películas de un actor
// ─────────────────────────────────────────────

const getFilmsByActor = async (req, res) => {
  const { actorId } = req.params;

  const { data, error } = await supabase
    .from("Actor_Film")
    .select(`
      id,
      rol,
      Films (
        id,
        titulo,
        img_portada,
        fecha_publicacion,
        estado
      )
    `)
    .eq("actor_id", actorId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// ─────────────────────────────────────────────
// POST /api/films/:filmId/actores
// Añade uno o varios actores a una película
// ─────────────────────────────────────────────

const addActoresToFilm = async (req, res) => {
  const { filmId } = req.params;
  const body = req.body;

  let rows = [];

  if (Array.isArray(body.actores)) {
    rows = body.actores.map((a) => ({
      film_id: Number(filmId),
      actor_id: Number(a.actor_id),
      rol: a.rol ?? null,
    }));
  } else if (body.actor_id) {
    rows = [
      {
        film_id: Number(filmId),
        actor_id: Number(body.actor_id),
        rol: body.rol ?? null,
      },
    ];
  } else {
    return res.status(400).json({
      error: "Se requiere actor_id o un array de actores",
    });
  }

  const { data, error } = await supabase
    .from("Actor_Film")
    .upsert(rows, {
      onConflict: "actor_id,film_id",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    inserted: data,
  });
};

// ─────────────────────────────────────────────
// DELETE /api/films/:filmId/actores/:actorId
// Elimina relación actor-película
// ─────────────────────────────────────────────

const removeActorFromFilm = async (req, res) => {
  const { filmId, actorId } = req.params;

  const { error } = await supabase
    .from("Actor_Film")
    .delete()
    .eq("film_id", filmId)
    .eq("actor_id", actorId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({
    message: "Relación eliminada correctamente",
  });
};

// ─────────────────────────────────────────────
// DELETE /api/films/:filmId/actores
// Elimina TODAS las relaciones actor-película
// ─────────────────────────────────────────────

const removeAllActoresFromFilm = async (req, res) => {
  const { filmId } = req.params;

  const { error } = await supabase
    .from("Actor_Film")
    .delete()
    .eq("film_id", filmId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({
    message: "Todas las relaciones de actores eliminadas",
  });
};

// ─────────────────────────────────────────────
// PUT /api/films/:filmId/actores
// Reemplaza TODOS los actores de una película
// ─────────────────────────────────────────────

const syncActoresFilm = async (req, res) => {
  const { filmId } = req.params;
  const { actores } = req.body;

  if (!Array.isArray(actores)) {
    return res.status(400).json({
      error: "actores debe ser un array",
    });
  }

  const { error: deleteError } = await supabase
    .from("Actor_Film")
    .delete()
    .eq("film_id", filmId);

  if (deleteError) {
    return res.status(500).json({
      error: deleteError.message,
    });
  }

  if (actores.length === 0) {
    return res.status(200).json({
      message: "Actores sincronizados (lista vacía)",
    });
  }

  const rows = actores.map((a) => ({
    film_id: Number(filmId),
    actor_id: Number(a.actor_id ?? a),
    rol: a.rol ?? null,
  }));

  const { data, error } = await supabase
    .from("Actor_Film")
    .insert(rows)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({
    synced: data,
  });
};

module.exports = {
  getActoresByFilm,
  getFilmsByActor,
  addActoresToFilm,
  removeActorFromFilm,
  removeAllActoresFromFilm,
  syncActoresFilm,
};