const supabase = require("../supabase");
const { uploadFile, deleteFiles } = require("../services/storageService");

const normalizeArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const firstValue = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const cleanText = (value) => {
  const v = firstValue(value);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};

const uploadPortada = async (file, movieId) => {
  return uploadFile(file.buffer, file.mimetype, `movies/${movieId}/portada`);
};

const uploadMediaFiles = async (files, movieId) => {
  const results = [];

  for (const file of files) {
    const result = await uploadFile(
      file.buffer,
      file.mimetype,
      `movies/${movieId}/media`
    );
    results.push(result);
  }

  return results;
};

const uploadTrailer = async (file, movieId) => {
  return uploadFile(file.buffer, file.mimetype, `movies/${movieId}/trailer`);
};

const getMovies = async (req, res) => {
  const { data, error } = await supabase
    .from("Films")
    .select(`*, Categoria_Film(categoria_id)`)
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const films = data.map((film) => ({
    ...film,
    categorias: (film.Categoria_Film ?? []).map((cat) => cat.categoria_id),
  }));

  res.status(200).json(films);
};

const getMovie = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Films")
    .select(`*, Categoria_Film(categoria_id, Categorias(*))`)
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });

  res.status(200).json(data);
};

const createMovie = async (req, res) => {
  const {
    titulo,
    sinopsis,
    fecha_publicacion,
    edad_recomendada,
    calificacion,
    pais_produccion,
    duracion,
    idioma_original,
    estado,
    categoria,
    plataformas,
  } = req.body;

  if (!titulo || !sinopsis || !fecha_publicacion) {
    return res.status(400).json({
      error: "titulo, sinopsis and fecha_publicacion are required.",
    });
  }

  const categorias = normalizeArray(
    categoria || req.body["categoria[]"] || req.body.categorias
  );

  const { data: movie, error: movieError } = await supabase
    .from("Films")
    .insert([
      {
        titulo,
        sinopsis,
        fecha_publicacion,
        edad_recomendada: edad_recomendada || null,
        calificacion: calificacion || null,
        pais_produccion,
        duracion: duracion || null,
        idioma_original,
        estado,
        trailer: null,
        img_portada: null,
        portada_alternativo: null,
        plataformas: plataformas || null,
      },
    ])
    .select()
    .single();

  if (movieError) return res.status(500).json({ error: movieError.message });

  const movieId = movie.id;
  const uploadedPaths = [];

  const rollback = async (reason) => {
    await deleteFiles(uploadedPaths);
    await supabase.from("Films").delete().eq("id", movieId);
    return res.status(500).json({ error: reason });
  };

  const portadaFiles = req.files?.portada ?? [];

  if (portadaFiles.length > 0) {
    try {
      const { publicUrl, storagePath } = await uploadPortada(
        portadaFiles[0],
        movieId
      );

      uploadedPaths.push(storagePath);

      const { error: updateError } = await supabase
        .from("Films")
        .update({
          img_portada: publicUrl,
          portada_storage_path: storagePath,
          portada_alternativo: cleanText(req.body.portada_alternativo),
        })
        .eq("id", movieId);

      if (updateError) {
        return rollback(`Failed to update img_portada: ${updateError.message}`);
      }
    } catch (err) {
      return rollback(`Portada upload failed: ${err.message}`);
    }
  }

  const trailerFiles = req.files?.trailer ?? [];

  if (trailerFiles.length > 0) {
    try {
      const { publicUrl, storagePath } = await uploadTrailer(
        trailerFiles[0],
        movieId
      );

      uploadedPaths.push(storagePath);

      const { error: updateError } = await supabase
        .from("Films")
        .update({
          trailer: publicUrl,
          trailer_storage_path: storagePath,
        })
        .eq("id", movieId);

      if (updateError) {
        return rollback(`Failed to update trailer: ${updateError.message}`);
      }
    } catch (err) {
      return rollback(`Trailer upload failed: ${err.message}`);
    }
  }

  const mediaFiles = req.files?.files ?? [];
  const mediaRecords = [];

  const rawAlts = req.body["files_alt[]"] ?? req.body.files_alt ?? [];
  const altsArray = normalizeArray(rawAlts);

  if (mediaFiles.length > 0) {
    try {
      const uploadedMedia = await uploadMediaFiles(mediaFiles, movieId);

      uploadedMedia.forEach(({ publicUrl, storagePath }, index) => {
        uploadedPaths.push(storagePath);

        mediaRecords.push({
          contenido: publicUrl,
          pelicula: movieId,
          storage_path: storagePath,
          alternativo: altsArray[index] ?? "",
        });
      });
    } catch (err) {
      return rollback(`Media upload failed: ${err.message}`);
    }

    const { error: mediaError } = await supabase
      .from("Contenido_Multimedia")
      .insert(mediaRecords);

    if (mediaError) {
      return rollback(`Media DB insert failed: ${mediaError.message}`);
    }
  }

  if (categorias.length > 0) {
    const categoriaRecords = categorias.map((catId) => ({
      film_id: movieId,
      categoria_id: Number(catId),
    }));

    const { error: categoriaError } = await supabase
      .from("Categoria_Film")
      .insert(categoriaRecords);

    if (categoriaError) {
      return rollback(
        `Categoria relation insert failed: ${categoriaError.message}`
      );
    }
  }

  const actoresIds = req.body["actores[]"] ?? req.body.actores ?? [];
  const actoresArray = normalizeArray(actoresIds);

  if (actoresArray.length > 0) {
    const actorRows = actoresArray.filter(Boolean).map((actorId) => ({
      film_id: movieId,
      actor_id: Number(actorId),
      rol: null,
    }));

    const { error: actorError } = await supabase
      .from("Actor_Film")
      .insert(actorRows);

    if (actorError) {
      console.error("Error inserting actor relations:", actorError.message);
    }
  }

  const directorIds = req.body["directores[]"] ?? req.body.directores ?? [];
  const directoresArray = normalizeArray(directorIds);
  if (directoresArray.length > 0) {
    const directorRows = directoresArray.filter(Boolean).map((directorId) => ({
      film_id: movieId,
      director_id: Number(directorId),
    }));
    const { error: directorError } = await supabase
      .from("Director_Film")
      .insert(directorRows);
    if (directorError) return rollback(`Director relation insert failed: ${directorError.message}`);
  }

  const { data: finalMovie, error: finalMovieError } = await supabase
    .from("Films")
    .select("*")
    .eq("id", movieId)
    .single();

  if (finalMovieError) {
    return rollback(`Failed to fetch final movie: ${finalMovieError.message}`);
  }

  res.status(201).json({
    movie: finalMovie,
    categories: categorias,
    media: mediaRecords.map((r) => r.contenido),
  });
};

const editMovie = async (req, res) => {
  const { id } = req.params;

  const { data: existing, error: fetchError } = await supabase
    .from("Films")
    .select("id, img_portada, portada_storage_path, trailer_storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Movie not found." });
  }

  const updates = { ...req.body };

  delete updates["files_alt[]"];
  delete updates.files_alt;

  delete updates["existing_media_ids[]"];
  delete updates.existing_media_ids;

  delete updates["existing_media_alts[]"];
  delete updates.existing_media_alts;

  delete updates.remove_portada;
  delete updates.remove_media;

  delete updates["actores[]"];
  delete updates.actores;

  delete updates["categoria[]"];
  delete updates.categoria;
  delete updates.categorias;

  ["edad_recomendada", "calificacion", "duracion"].forEach((field) => {
    if (updates[field] === "") {
      updates[field] = null;
    }
  });

  const uploadedPaths = [];

  if (req.body.remove_portada === "true" && existing.portada_storage_path) {
    await deleteFiles([existing.portada_storage_path]);

    updates.img_portada = null;
    updates.portada_storage_path = null;
    updates.portada_alternativo = null;
  }

  const portadaFiles = req.files?.portada ?? [];

  if (portadaFiles.length > 0) {
    try {
      const { publicUrl, storagePath } = await uploadPortada(
        portadaFiles[0],
        id
      );

      uploadedPaths.push(storagePath);

      updates.img_portada = publicUrl;
      updates.portada_storage_path = storagePath;
      updates.portada_alternativo = cleanText(req.body.portada_alternativo);

      if (existing.portada_storage_path) {
        await deleteFiles([existing.portada_storage_path]);
      }
    } catch (err) {
      await deleteFiles(uploadedPaths);

      return res.status(500).json({
        error: `Portada upload failed: ${err.message}`,
      });
    }
  } else if (
    req.body.portada_alternativo !== undefined &&
    req.body.remove_portada !== "true"
  ) {
    updates.portada_alternativo = cleanText(req.body.portada_alternativo);
  }

  const trailerFiles = req.files?.trailer ?? [];

  if (trailerFiles.length > 0) {
    try {
      const { publicUrl, storagePath } = await uploadTrailer(
        trailerFiles[0],
        id
      );

      uploadedPaths.push(storagePath);

      updates.trailer = publicUrl;
      updates.trailer_storage_path = storagePath;

      if (existing.trailer_storage_path) {
        await deleteFiles([existing.trailer_storage_path]);
      }
    } catch (err) {
      await deleteFiles(uploadedPaths);

      return res.status(500).json({
        error: `Trailer upload failed: ${err.message}`,
      });
    }
  }

  const mediaFiles = req.files?.files ?? [];
  const mediaRecords = [];

  if (mediaFiles.length > 0) {
    const rawAlts = req.body["files_alt[]"] ?? req.body.files_alt ?? [];
    const altsArray = normalizeArray(rawAlts);

    try {
      const uploadedMedia = await uploadMediaFiles(mediaFiles, id);

      uploadedMedia.forEach(({ publicUrl, storagePath }, index) => {
        uploadedPaths.push(storagePath);

        mediaRecords.push({
          contenido: publicUrl,
          pelicula: Number(id),
          storage_path: storagePath,
          alternativo: altsArray[index] ?? "",
        });
      });
    } catch (err) {
      await deleteFiles(uploadedPaths);

      return res.status(500).json({
        error: `Media upload failed: ${err.message}`,
      });
    }

    const { error: mediaError } = await supabase
      .from("Contenido_Multimedia")
      .insert(mediaRecords);

    if (mediaError) {
      await deleteFiles(uploadedPaths);

      return res.status(500).json({
        error: `Media DB insert failed: ${mediaError.message}`,
      });
    }
  }

  const { data, error } = await supabase
    .from("Films")
    .update(updates)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    console.error("EDIT MOVIE ERROR:", error);
    console.error("UPDATES SENT:", updates);

    await deleteFiles(uploadedPaths);

    return res.status(500).json({ error: error.message });
  }

  const existingMediaIds = normalizeArray(
    req.body["existing_media_ids[]"] || req.body.existing_media_ids
  );

  const existingMediaAlts = normalizeArray(
    req.body["existing_media_alts[]"] || req.body.existing_media_alts
  );

  if (existingMediaIds.length > 0) {
    for (let i = 0; i < existingMediaIds.length; i++) {
      const mediaId = existingMediaIds[i];
      const altText = existingMediaAlts[i] || "";

      const { data: updatedMedia, error: altError } = await supabase
        .from("Contenido_Multimedia")
        .update({ alternativo: altText })
        .eq("id", Number(mediaId))
        .eq("pelicula", Number(id))
        .select();

      if (altError) {
        return res.status(500).json({
          error: `Failed updating media alt text: ${altError.message}`,
        });
      }

      console.log("Updated media alt:", updatedMedia);
    }
  }

  const categorias = normalizeArray(
    req.body.categoria || req.body["categoria[]"] || req.body.categorias
  );

  await supabase.from("Categoria_Film").delete().eq("film_id", Number(id));

  if (categorias.length > 0) {
    const categoriaRows = categorias.filter(Boolean).map((catId) => ({
      film_id: Number(id),
      categoria_id: Number(catId),
    }));

    const { error: categoriaError } = await supabase
      .from("Categoria_Film")
      .insert(categoriaRows);

    if (categoriaError) {
      return res.status(500).json({ error: categoriaError.message });
    }
  }

  const actoresIds = normalizeArray(req.body["actores[]"] || req.body.actores);

  await supabase.from("Actor_Film").delete().eq("film_id", Number(id));

  if (actoresIds.length > 0) {
    const actorRows = actoresIds.filter(Boolean).map((actorId) => ({
      film_id: Number(id),
      actor_id: Number(actorId),
      rol: null,
    }));

    const { error: actorError } = await supabase
      .from("Actor_Film")
      .insert(actorRows);

    if (actorError) {
      return res.status(500).json({ error: actorError.message });
    }
  }

  res.status(200).json({
    movie: data,
    categories: categorias,
    actors: actoresIds,
    media: mediaRecords.map((r) => r.contenido),
  });
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;

  const { data: movie, error: movieError } = await supabase
    .from("Films")
    .select("id, portada_storage_path, trailer_storage_path")
    .eq("id", id)
    .single();

  if (movieError || !movie) {
    return res.status(404).json({ error: "Movie not found." });
  }

  const { data: mediaRows, error: mediaError } = await supabase
    .from("Contenido_Multimedia")
    .select("storage_path")
    .eq("pelicula", id);

  if (mediaError) {
    return res.status(500).json({ error: mediaError.message });
  }

  const pathsToDelete = [
    movie.portada_storage_path,
    movie.trailer_storage_path,
    ...(mediaRows?.map((m) => m.storage_path) || []),
  ].filter(Boolean);

  if (pathsToDelete.length > 0) {
    await deleteFiles(pathsToDelete);
  }

  const { error: deleteError } = await supabase
    .from("Films")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  return res.status(200).json({
    message: "Movie and all related DB data deleted successfully.",
  });
};

const uploadMovieMedia = async (req, res) => {
  const { id } = req.params;

  const portadaFiles = req.files?.portada ?? [];
  const mediaFiles = req.files?.files ?? [];

  if (!portadaFiles.length && !mediaFiles.length) {
    return res.status(400).json({ error: "No files provided." });
  }

  const { data: movie, error: movieError } = await supabase
    .from("Films")
    .select("id, portada_storage_path")
    .eq("id", id)
    .single();

  if (movieError || !movie) {
    return res.status(404).json({ error: "Movie not found." });
  }

  const uploadedPaths = [];

  const rollback = async (reason) => {
    await deleteFiles(uploadedPaths);
    return res.status(500).json({ error: reason });
  };

  if (portadaFiles.length > 0) {
    try {
      const { publicUrl, storagePath } = await uploadPortada(
        portadaFiles[0],
        id
      );

      uploadedPaths.push(storagePath);

      const { error: updateError } = await supabase
        .from("Films")
        .update({
          img_portada: publicUrl,
          portada_storage_path: storagePath,
          portada_alternativo: cleanText(req.body.portada_alternativo),
        })
        .eq("id", id);

      if (updateError) {
        return rollback(`img_portada update failed: ${updateError.message}`);
      }

      if (movie.portada_storage_path) {
        await deleteFiles([movie.portada_storage_path]);
      }
    } catch (err) {
      return rollback(`Portada upload failed: ${err.message}`);
    }
  }

  const mediaRecords = [];

  if (mediaFiles.length > 0) {
    const rawAlts = req.body["files_alt[]"] ?? req.body.files_alt ?? [];
    const altsArray = normalizeArray(rawAlts);

    try {
      const uploadedMedia = await uploadMediaFiles(mediaFiles, id);

      uploadedMedia.forEach(({ publicUrl, storagePath }, index) => {
        uploadedPaths.push(storagePath);

        mediaRecords.push({
          contenido: publicUrl,
          pelicula: id,
          storage_path: storagePath,
          alternativo: altsArray[index] ?? "",
        });
      });
    } catch (err) {
      return rollback(`Media upload failed: ${err.message}`);
    }

    const { data: mediaData, error: mediaError } = await supabase
      .from("Contenido_Multimedia")
      .insert(mediaRecords)
      .select();

    if (mediaError) {
      return rollback(`Media DB insert failed: ${mediaError.message}`);
    }

    return res.status(201).json({
      message: `${mediaFiles.length} file(s) uploaded successfully.`,
      media: mediaData,
    });
  }

  res.status(200).json({ message: "Portada updated successfully." });
};

const getMovieMedia = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Contenido_Multimedia")
    .select("*")
    .eq("pelicula", id)
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

const deleteMovieMediaItem = async (req, res) => {
  const { id, mediaId } = req.params;

  const { data: mediaRow, error: fetchError } = await supabase
    .from("Contenido_Multimedia")
    .select("id, storage_path, pelicula")
    .eq("id", Number(mediaId))
    .eq("pelicula", Number(id))
    .single();

  if (fetchError || !mediaRow) {
    return res
      .status(404)
      .json({ error: "Media item not found for this movie." });
  }

  if (mediaRow.storage_path) {
    await deleteFiles([mediaRow.storage_path]);
  }

  const { error: deleteError } = await supabase
    .from("Contenido_Multimedia")
    .delete()
    .eq("id", Number(mediaId));

  if (deleteError) {
    return res.status(500).json({
      error: `DB delete failed: ${deleteError.message}`,
    });
  }

  res.status(200).json({ message: "Media item deleted successfully." });
};

const filterMovies = async (req, res) => {
  const { titulo, director, estado, pais_produccion, calificacion } = req.query;

  let query = supabase.from("Films").select("*");

  if (titulo) query = query.ilike("titulo", `%${titulo}%`);
  if (director) query = query.ilike("director", `%${director}%`);
  if (estado) query = query.ilike("estado", `%${estado}%`);
  if (pais_produccion) {
    query = query.ilike("pais_produccion", `%${pais_produccion}%`);
  }
  if (calificacion) query = query.eq("calificacion", calificacion);

  const { data, error } = await query.order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

const getMovieActors = async (req, res) => {
  const { id } = req.params;

  const { data: relations, error: relError } = await supabase
    .from("Actor_Film")
    .select("actor_id, rol")
    .eq("film_id", id);

  if (relError) return res.status(500).json({ error: relError.message });

  if (!relations.length) return res.status(200).json([]);

  const actorIds = relations.map((r) => r.actor_id);
  const rolByActor = new Map(relations.map((r) => [r.actor_id, r.rol]));

  const { data: actores, error: actError } = await supabase
    .from("Actores")
    .select("id, nombre, foto_perfil")
    .in("id", actorIds);

  if (actError) return res.status(500).json({ error: actError.message });

  const result = actores.map((a) => ({
    ...a,
    rol: rolByActor.get(a.id) || null,
  }));

  res.status(200).json(result);
};

module.exports = {
  getMovies,
  getMovie,
  createMovie,
  editMovie,
  deleteMovie,
  filterMovies,
  uploadMovieMedia,
  getMovieMedia,
  deleteMovieMediaItem,
  getMovieActors,
};