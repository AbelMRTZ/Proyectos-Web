const supabase = require("../supabase");

// GET /api/directores
const getDirectores = async (req, res) => {
  const { data, error } = await supabase
    .from("Directores")
    .select(`
      id,
      nombre,
      biografia,
      foto_perfil
    `)
    .order("nombre");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/directores/:id
const getDirector = async (req, res) => {
  const { id } = req.params;

  // Primero traemos el director
  const { data: director, error } = await supabase
    .from("Directores")
    .select(`
      id,
      nombre,
      biografia,
      foto_perfil,
      nacionalidad,
      fecha_nacimiento
    `)
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Luego sus películas via la tabla pivot
  const { data: relaciones, error: relError } = await supabase
    .from("Director_Film")
    .select(`
      Films (
        id,
        titulo,
        img_portada,
        fecha_publicacion
      )
    `)
    .eq("director_id", id);

  if (relError) return res.status(500).json({ error: relError.message });

  const films = relaciones.map((r) => r.Films).filter(Boolean);

  res.status(200).json({ ...director, Films: films });
};
// GET /api/directores/buscar?q=nolan
const searchDirectores = async (req, res) => {
  const { q } = req.query;

  const { data, error } = await supabase
    .from("Directores")
    .select(`
      id,
      nombre,
      biografia
    `)
    .ilike("nombre", `%${q}%`)
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

module.exports = {
  getDirectores,
  getDirector,
  searchDirectores,
};