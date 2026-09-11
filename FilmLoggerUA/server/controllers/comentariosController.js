const supabase = require("../supabase");

// GET /api/comments
const getComments = async (req, res) => {
  const { data, error } = await supabase
    .from("Comentarios")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/comments/:id
const getComment = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Comentarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/comments/user/:usuario
const getUserComments = async (req, res) => {
  const { usuario } = req.params;

  const { data, error } = await supabase
    .from("Comentarios")
    .select("*")
    .eq("usuario", usuario)
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// GET /api/comments/film/:pelicula
const getFilmComments = async (req, res) => {
  const { pelicula } = req.params;

  const { data: comments, error } = await supabase
    .from("Comentarios")
    .select("*")
    .eq("pelicula", pelicula)
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  if (!comments.length) return res.status(200).json([]);

  // Join manual: evita depender de FK definida en Supabase
  const usuarioIds = [...new Set(comments.map((c) => c.usuario).filter(Boolean))];
  const { data: perfiles } = await supabase
    .from("Perfiles")
    .select("id, nombre, apellidos, foto_perfil")
    .in("id", usuarioIds);

  const perfilMap = new Map((perfiles || []).map((p) => [p.id, p]));

  const enriched = comments.map((c) => ({
    ...c,
    Perfiles: perfilMap.get(c.usuario) || null,
  }));

  res.status(200).json(enriched);
};

// POST /api/comments
const createComment = async (req, res) => {
  const { usuario, pelicula, comentariol, valoracion } = req.body;

  if (!usuario || !pelicula) {
    return res.status(400).json({
      error: "usuario y pelicula are required",
    });
  }

  const record = { usuario, pelicula, comentariol };
  if (valoracion !== undefined) record.valoracion = parseInt(valoracion, 10);

  const { data, error } = await supabase
    .from("Comentarios")
    .insert([record])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Adjuntar datos del perfil del autor en la respuesta
  const { data: perfil } = await supabase
    .from("Perfiles")
    .select("id, nombre, apellidos, foto_perfil")
    .eq("id", usuario)
    .single();

  res.status(201).json({ ...data, Perfiles: perfil || null });
};

// PUT /api/comments/:id
const editComment = async (req, res) => {
  const { id } = req.params;
  const { usuario, pelicula, comentariol } = req.body;

  const { data, error } = await supabase
    .from("Comentarios")
    .update({
      usuario,
      pelicula,
      comentariol,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("Comentarios")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Comment deleted successfully" });
};

module.exports = {
  getComments,
  getComment,
  getUserComments,
  getFilmComments,
  createComment,
  editComment,
  deleteComment,
};