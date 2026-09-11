const supabase = require("../supabase");

// GET /api/imagenes
const getImagenes = async (req, res) => {
  const { data, error } = await supabase
    .from("Imagenes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/imagenes/:id
const getImagen = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Imagenes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/imagenes/film/:pelicula
const getImagenesFilm = async (req, res) => {
  const { pelicula } = req.params;

  const { data, error } = await supabase
    .from("Imagenes")
    .select("*")
    .eq("pelicula", pelicula)
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No imagenes found for this movie" });
  }

  res.status(200).json(data);
};

// POST /api/imagenes
const createImagen = async (req, res) => {
  const { img, pelicula } = req.body;

  if (!img || !pelicula) {
    return res.status(400).json({
      error: "img y pelicula are required",
    });
  }

  const { data, error } = await supabase
    .from("Imagenes")
    .insert([
      {
        img,
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

// PUT /api/imagenes/:id
const editImagen = async (req, res) => {
  const { id } = req.params;
  const { img, pelicula } = req.body;

  const { data, error } = await supabase
    .from("Imagenes")
    .update({
      img,
      pelicula,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// DELETE /api/imagenes/:id
const deleteImagen = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("Imagenes")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Imagen deleted successfully" });
};

module.exports = {
  getImagenes,
  getImagen,
  getImagenesFilm,
  createImagen,
  editImagen,
  deleteImagen,
};