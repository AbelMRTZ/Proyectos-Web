const supabase = require("../supabase");

// GET /api/actores
const getActores = async (req, res) => {
  const { data, error } = await supabase
    .from("Actores")
    .select(`
      id,
      nombre,
      foto_perfil,
      fecha_nacimiento,
      nacionalidad
    `)
    .order("nombre");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/actores/:id
const getActor = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Actores")
    .select(`
      id,
      nombre,
      biografia,
      fecha_nacimiento,
      foto_perfil,
      nacionalidad,
      Actor_Film (
        rol,
        Films (
          id,
          titulo,
          img_portada,
          fecha_publicacion
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/actores/buscar?q=tom
const searchActores = async (req, res) => {
  const { q } = req.query;

  const { data, error } = await supabase
    .from("Actores")
    .select(`
      id,
      nombre,
      foto_perfil,
      fecha_nacimiento
    `)
    .ilike("nombre", `%${q}%`)
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/actores/film/:filmId
const getActoresByFilm = async (req, res) => {
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

  const result = actores.map((a) => ({ ...a, rol: rolByActor.get(a.id) || null }));
  res.status(200).json(result);
};

module.exports = {
  getActores,
  getActor,
  searchActores,
  getActoresByFilm,
};