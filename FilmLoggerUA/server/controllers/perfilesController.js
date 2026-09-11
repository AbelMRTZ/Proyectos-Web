const supabase = require("../supabase");
const { uploadFile, deleteFiles } = require("../services/storageService");

// GET /api/perfiles
const getPerfiles = async (req, res) => {
  const { data: perfiles, error } = await supabase
    .from("Perfiles")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { data: authUsers, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    return res.status(500).json({ error: authError.message });
  }

  const usersById = new Map(
    authUsers.users.map((authUser) => [authUser.id, authUser])
  );

  const perfilesConEmail = perfiles.map((perfil) => {
    const authUser = usersById.get(perfil.auth_id);
    const email = authUser?.email || "";

    return {
      ...perfil,
      email,
      usuario: email ? email.split("@")[0] : "usuario",
    };
  });

  res.status(200).json(perfilesConEmail);
};

// GET /api/perfiles/:id
const getPerfil = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Perfiles")
    .select("*")
    .eq("auth_id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.status(200).json(data);
};

// POST /api/perfiles
const createPerfil = async (req, res) => {
  const {
    nombre,
    apellidos,
    foto_perfil,
  } = req.body;

  const { data, error } = await supabase
    .from("Perfiles")
    .insert([
      {
        nombre,
        apellidos,
        foto_perfil,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
};

// PUT /api/perfiles/:id
const editPerfil = async (req, res) => {
  try {
    const auth_id = req.params.id;
    const { nombre, apellidos, accesibilidad } = req.body ?? {};

    const { data: existing, error: fetchError } = await supabase
      .from("Perfiles")
      .select("*")
      .eq("auth_id", auth_id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Perfil not found." });
    }

    const updateData = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellidos !== undefined) updateData.apellidos = apellidos;
    if (accesibilidad !== undefined) updateData.accesibilidad = accesibilidad;

    const fotoFiles = req.files?.foto_perfil ?? [];

    if (fotoFiles.length > 0) {
      if (existing.foto_storage_path) {
        await deleteFiles([existing.foto_storage_path]);
      }

      const { publicUrl, storagePath } = await uploadFile(
        fotoFiles[0].buffer,
        fotoFiles[0].mimetype,
        `perfiles/${existing.id}`
      );

      updateData.foto_perfil = publicUrl;
      updateData.foto_storage_path = storagePath;
    }

    const { data, error } = await supabase
      .from("Perfiles")
      .update(updateData)
      .eq("auth_id", auth_id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("[editPerfil]", err);
    res.status(500).json({ error: err.message || "Error updating profile." });
  }
};

// DELETE /api/perfiles/:id
const deletePerfil = async (req, res) => {
  const auth_id = req.params.id;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("Perfiles")
      .select("*")
      .eq("auth_id", auth_id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Perfil not found." });
    }

    const usuarioId = existing.id;

    const { error: favoritasError } = await supabase
      .from("Favoritas")
      .delete()
      .eq("usuario", usuarioId);

    if (favoritasError) throw favoritasError;

    const { error: comentariosError } = await supabase
      .from("Comentarios")
      .delete()
      .eq("usuario", usuarioId);

    if (comentariosError) throw comentariosError;

    const { error: calificacionesError } = await supabase
      .from("Calificacion")
      .delete()
      .eq("usuario", usuarioId);

    if (calificacionesError) throw calificacionesError;

    if (existing.foto_storage_path) {
      await deleteFiles([existing.foto_storage_path]);
    }

    const { error: perfilError } = await supabase
      .from("Perfiles")
      .delete()
      .eq("auth_id", auth_id);

    if (perfilError) throw perfilError;

    const { error: authDeleteError } =
      await supabase.auth.admin.deleteUser(auth_id);

    if (authDeleteError) throw authDeleteError;

    res.status(200).json({
      message: "Perfil, datos relacionados, imagen y usuario auth eliminados correctamente",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Error deleting profile.",
    });
  }
};

module.exports = {
  getPerfiles,
  getPerfil,
  createPerfil,
  editPerfil,
  deletePerfil,
};