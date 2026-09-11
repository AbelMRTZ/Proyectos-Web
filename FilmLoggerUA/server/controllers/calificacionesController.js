const supabase = require("../supabase");

// GET /api/calificaciones
const getCalificaciones = async (req, res) => {
  const { data, error } = await supabase
    .from("Calificacion")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/calificaciones/:pelicula/:usuario
const getCalificacion = async (req, res) => {
  const { pelicula, usuario } = req.params;

  const { data, error } = await supabase
    .from("Calificacion")
    .select("*")
    .eq("pelicula", pelicula)
    .eq("usuario", usuario)
    .maybeSingle(); // ← returns null instead of error when not found

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(200).json(null); // ← 200 with null, not 404
  }

  res.status(200).json(data);
};

// GET /api/calificaciones/film/:pelicula
const getCalificacionFilm = async (req, res) => {
  const { pelicula } = req.params;

  const { data, error } = await supabase
    .from("Calificacion")
    .select("*")
    .eq("pelicula", pelicula)
    .order("puntuacion", { ascending: false }); // ✅ correct

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No calificaciones for this movie" });
  }

  res.status(200).json(data);
};

// POST /api/calificaciones
const createCalificacion = async (req, res) => {
  const { pelicula, usuario, puntuacion } = req.body;

  if (!pelicula || !usuario || puntuacion === undefined) {
    return res.status(400).json({
      error: "pelicula, usuario y puntuacion are required",
    });
  }

  const { data, error } = await supabase
    .from("Calificacion")
    .insert([
      {
        pelicula,
        usuario,
        puntuacion: parseFloat(puntuacion),
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
};

// PUT /api/calificaciones/:pelicula/:usuario
const editCalificacion = async (req, res) => {
  const { pelicula, usuario } = req.params;
  const { puntuacion } = req.body;

  const { data, error } = await supabase
    .from("Calificacion")
    .update({ puntuacion: parseFloat(puntuacion) })
    .eq("pelicula", pelicula)
    .eq("usuario", usuario)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// DELETE /api/calificaciones/:pelicula/:usuario
const deleteCalificacion = async (req, res) => {
  const { pelicula, usuario } = req.params;

  const { error } = await supabase
    .from("Calificacion")
    .delete()
    .eq("pelicula", pelicula)
    .eq("usuario", usuario);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Calificacion deleted successfully" });
};

module.exports = {
  getCalificaciones,
  getCalificacion,
  getCalificacionFilm,
  createCalificacion,
  editCalificacion,
  deleteCalificacion,
};