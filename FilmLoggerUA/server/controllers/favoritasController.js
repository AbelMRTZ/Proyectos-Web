const supabase = require("../supabase");

// GET /api/favoritas
const getFavoritas = async (req, res) => {
  const { data, error } = await supabase
    .from("Favoritas")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/favoritas/:id
const getFavorita = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Favoritas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/favoritas/user/:usuario
const getFavoritasByUser = async (req, res) => {
  const { usuario } = req.params;

  const { data, error } = await supabase
    .from("Favoritas")
    .select("*")
    .eq("usuario", usuario);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/favoritas/film/:pelicula
const getFavoritasByFilm = async (req, res) => {
  const { pelicula } = req.params;

  const { data, error } = await supabase
    .from("Favoritas")
    .select("*")
    .eq("pelicula", pelicula);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// POST /api/favoritas
const createFavorita = async (req, res) => {
  const { usuario, pelicula } = req.body;

  if (!usuario || !pelicula) {
    return res.status(400).json({
      error: "usuario y pelicula are required",
    });
  }

  const { data, error } = await supabase
    .from("Favoritas")
    .insert([
      {
        usuario,
        pelicula,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
};

// DELETE /api/favoritas/:usuario/:pelicula
const deleteFavorita = async (req, res) => {
  const { usuario, pelicula } = req.params;

  const { error } = await supabase
    .from("Favoritas")
    .delete()
    .eq("usuario", usuario)
    .eq("pelicula", pelicula);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Favorita deleted successfully" });
};

module.exports = {
  getFavoritas,
  getFavorita,
  getFavoritasByUser,
  getFavoritasByFilm,
  createFavorita,
  deleteFavorita,
};