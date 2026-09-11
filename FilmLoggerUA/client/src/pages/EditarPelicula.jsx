import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../css/CrearPelicula.css";
import AccessibilityButton from "../components/boton_accesibilidad";

import netflixLogo from "../img/netflix.png";
import primeLogo from "../img/prime.png";
import hboLogo from "../img/hbo.png";
import disneyLogo from "../img/disney.png";
import appleLogo from "../img/apple.png";
import movistarLogo from "../img/movistar.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE}/api/films`;
const CATEGORIES_URL = `${API_BASE}/api/categorias`;
const ACTORES_URL = `${API_BASE}/api/actores`;
const DIRECTORES_URL = `${API_BASE}/api/directores`;

const PLATFORM_MAP = {
  n: { name: "Netflix", logo: netflixLogo },
  p: { name: "Prime Video", logo: primeLogo },
  h: { name: "HBO Max", logo: hboLogo },
  d: { name: "Disney+", logo: disneyLogo },
  a: { name: "Apple TV+", logo: appleLogo },
  m: { name: "Movistar+", logo: movistarLogo },
};

export default function EditarPelicula() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [actores, setActores] = useState([]);
  const [directores, setDirectores] = useState([]);

  const [actorSearch, setActorSearch] = useState("");
  const [directorSearch, setDirectorSearch] = useState("");
  const [directoresSeleccionados, setDirectoresSeleccionados] = useState([]);

  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    sinopsis: "",
    fecha_publicacion: "",
    edad_recomendada: "",
    calificacion: "",
    pais_produccion: "",
    duracion: "",
    idioma_original: "",
    categoria: [],
    actores: [],
    directores: [],
    estado: "activo",
    plataformas: "",
    portada_alternativo: "",
  });

  const [portada, setPortada] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaAlts, setMediaAlts] = useState({});
  const [trailerFile, setTrailerFile] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);

  const [existingMedia, setExistingMedia] = useState([]);
  const [existingPortada, setExistingPortada] = useState(null);
  const [existingTrailer, setExistingTrailer] = useState(null);
  const [portadaRemoved, setPortadaRemoved] = useState(false);

  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [deletingMedia, setDeletingMedia] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
      return;
    }

    loadData();
  }, [id, user, navigate]);

  const loadData = async () => {
    try {
      const [
        movieRes,
        mediaRes,
        actoresMovieRes,
        directoresMovieRes,
        categoriesRes,
        actoresRes,
        directoresRes,
      ] = await Promise.all([
        fetch(`${API_URL}/${id}`),
        fetch(`${API_URL}/${id}/media`),
        fetch(`${API_BASE}/api/actores/film/${id}`),
        fetch(`${API_BASE}/api/directorFilm/films/${id}/directores`),
        fetch(CATEGORIES_URL),
        fetch(`${ACTORES_URL}?limit=200`),
        fetch(DIRECTORES_URL),
      ]);

      if (!movieRes.ok) throw new Error("No se pudo cargar la película.");

      const movie = await movieRes.json();
      const media = mediaRes.ok ? await mediaRes.json() : [];
      const actoresMovie = actoresMovieRes.ok ? await actoresMovieRes.json() : [];
      const directoresMovie = directoresMovieRes.ok
        ? await directoresMovieRes.json()
        : [];

      const categoriesData = await categoriesRes.json();
      const actoresData = await actoresRes.json();
      const directoresData = await directoresRes.json();

      const selectedDirectores = directoresMovie
        .map((row) => row.Directores)
        .filter(Boolean);

      setCategories(categoriesData);
      setActores(actoresData);
      setDirectores(directoresData);
      setDirectoresSeleccionados(selectedDirectores);

      setExistingMedia(media || []);
      setExistingPortada(movie.img_portada || null);
      setExistingTrailer(movie.trailer || null);

      setForm({
        titulo: movie.titulo || "",
        sinopsis: movie.sinopsis || "",
        fecha_publicacion: movie.fecha_publicacion || "",
        edad_recomendada: movie.edad_recomendada || "",
        calificacion: movie.calificacion || "",
        pais_produccion: movie.pais_produccion || "",
        duracion: movie.duracion || "",
        idioma_original: movie.idioma_original || "",
        categoria: Array.isArray(movie.Categoria_Film)
        ? movie.Categoria_Film.map((c) => String(c.categoria_id))
        : [],
        actores: actoresMovie.map((a) => String(a.id)),
        directores: selectedDirectores.map((d) => String(d.id)),
        estado: movie.estado || "activo",
        plataformas: movie.plataformas || "",
        portada_alternativo: movie.portada_alternativo || "",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoadingMovie(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      categoria: prev.categoria.includes(value)
        ? prev.categoria.filter((c) => c !== value)
        : [...prev.categoria, value],
    }));
  };

  const handleActorToggle = (actorId) => {
    const strId = String(actorId);

    setForm((prev) => ({
      ...prev,
      actores: prev.actores.includes(strId)
        ? prev.actores.filter((a) => a !== strId)
        : [...prev.actores, strId],
    }));
  };

  const removeActor = (actorId) => {
    setForm((prev) => ({
      ...prev,
      actores: prev.actores.filter((a) => a !== String(actorId)),
    }));
  };

  const selectDirector = (director) => {
    if (form.directores.includes(String(director.id))) return;

    setDirectoresSeleccionados((prev) => [...prev, director]);

    setForm((prev) => ({
      ...prev,
      directores: [...prev.directores, String(director.id)],
    }));

    setDirectorSearch("");
  };

  const removeDirector = (directorId) => {
    setDirectoresSeleccionados((prev) =>
      prev.filter((d) => d.id !== directorId)
    );

    setForm((prev) => ({
      ...prev,
      directores: prev.directores.filter((d) => d !== String(directorId)),
    }));
  };

  const handleMediaFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeNewMediaFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));

    setMediaAlts((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numberKey = Number(key);

        if (numberKey < index) updated[numberKey] = value;
        if (numberKey > index) updated[numberKey - 1] = value;
      });

      return updated;
    });
  };

  const openDeleteMediaModal = (media) => {
    setMediaToDelete(media);
    setShowDeleteMediaModal(true);
  };

  const closeDeleteMediaModal = () => {
    setMediaToDelete(null);
    setShowDeleteMediaModal(false);
  };

  const confirmDeleteExistingMedia = async () => {
    if (!mediaToDelete) return;

    setDeletingMedia(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/films/${id}/media/${mediaToDelete.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo eliminar el archivo.");
      }

      setExistingMedia((prev) =>
        prev.filter((item) => item.id !== mediaToDelete.id)
      );

      closeDeleteMediaModal();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setDeletingMedia(false);
    }
  };

  const handleDeleteCurrentPortada = () => {
    setExistingPortada(null);
    setPortada(null);
    setPortadaRemoved(true);

    setForm((prev) => ({
      ...prev,
      portada_alternativo: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "directores") return;

        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (portadaRemoved) {
        formData.append("remove_portada", "true");
      }

      existingMedia.forEach((item) => {
        formData.append("existing_media_ids[]", String(item.id));
        formData.append("existing_media_alts[]", item.alternativo || "");
      });

      if (portada) {
        formData.append("portada", portada);
      }

      if (trailerFile) {
        formData.append("trailer", trailerFile);
      }

      mediaFiles.forEach((file, index) => {
        formData.append("files", file);
        formData.append("files_alt[]", mediaAlts[index] || "");
      });

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al editar película");
      }

    const directorSyncRes = await fetch(
        `${API_BASE}/api/directorFilm/films/${id}/directores`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            directores: form.directores.map((directorId) => ({
              director_id: Number(directorId),
            })),
          }),
        }
      );

      const directorSyncJson = await directorSyncRes.json();

      if (!directorSyncRes.ok) {
        throw new Error(
          directorSyncJson.error || "Error al sincronizar directores"
        );
      }

      setStatus({
        type: "success",
        message: "Película actualizada correctamente.",
      });

      navigate(`/pelicula/${id}`);

      setPortada(null);
      setPortadaRemoved(false);
      setMediaFiles([]);
      setMediaAlts({});
      setTrailerFile(null);
      setTrailerPreview(null);

      await loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const actoresFiltrados = actores.filter(
    (a) =>
      a.nombre.toLowerCase().includes(actorSearch.toLowerCase()) &&
      !form.actores.includes(String(a.id))
  );

  const actoresSeleccionados = actores.filter((a) =>
    form.actores.includes(String(a.id))
  );

  const directoresFiltrados = directores.filter(
    (d) =>
      d.nombre.toLowerCase().includes(directorSearch.toLowerCase()) &&
      !form.directores.includes(String(d.id))
  );

  if (loadingMovie) {
    return (
      <div className="crear-wrapper">
        <Navbar />
        <p className="home-message">Cargando película...</p>
      </div>
    );
  }

  return (
    <div className="crear-wrapper">
      <Navbar />

      <div className="crear-hero">
        <div>
          <h1>Editar película</h1>
          <p className="crear-hero__sub">
            Modifica los datos de la película y guarda los cambios
          </p>
        </div>
      </div>
      <div className="crear-topbar">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Volver</span>
        </button>
      </div>
      <div className="crear-content">
        <div className="crear-card">
          <form className="movie-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Sinopsis</label>
              <textarea
                name="sinopsis"
                rows={4}
                value={form.sinopsis}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de estreno</label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={form.fecha_publicacion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Edad recomendada</label>
                <input
                  type="number"
                  name="edad_recomendada"
                  value={form.edad_recomendada}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Director</label>

              {directoresSeleccionados.length > 0 && (
                <div className="actor-chips">
                  {directoresSeleccionados.map((director) => (
                    <span key={director.id} className="actor-chip">
                      {director.nombre}
                      <button
                        type="button"
                        className="actor-chip-remove"
                        onClick={() => removeDirector(director.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                className="actor-search-input"
                placeholder="Buscar director..."
                value={directorSearch}
                onChange={(e) => setDirectorSearch(e.target.value)}
              />

              {directorSearch.trim().length > 0 && (
                <div className="actor-dropdown">
                  {directoresFiltrados.length === 0 ? (
                    <p className="actor-dropdown-empty">Sin resultados</p>
                  ) : (
                    directoresFiltrados.slice(0, 8).map((director) => (
                      <button
                        key={director.id}
                        type="button"
                        className="actor-dropdown-item"
                        onClick={() => selectDirector(director)}
                      >
                        {director.nombre}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>País de producción</label>
                <input
                  type="text"
                  name="pais_produccion"
                  value={form.pais_produccion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Idioma original</label>
                <input
                  type="text"
                  name="idioma_original"
                  value={form.idioma_original}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duración</label>
                <input
                  type="number"
                  name="duracion"
                  value={form.duracion}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Calificación</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        Number(form.calificacion) >= star ? "active" : ""
                      }`}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          calificacion: String(star),
                        }))
                      }
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}

                  {form.calificacion && (
                    <button
                      type="button"
                      className="trailer-remove-btn"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, calificacion: "" }))
                      }
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Categorías</label>
              <div className="checkbox-group">
                {categories.map((cat) => (
                  <label key={cat.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={form.categoria.includes(String(cat.id))}
                      onChange={handleCategoryChange}
                    />
                    {cat.categoria}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Actores</label>

              {actoresSeleccionados.length > 0 && (
                <div className="actor-chips">
                  {actoresSeleccionados.map((actor) => (
                    <span key={actor.id} className="actor-chip">
                      {actor.nombre}
                      <button
                        type="button"
                        className="actor-chip-remove"
                        onClick={() => removeActor(actor.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                className="actor-search-input"
                placeholder="Buscar actor..."
                value={actorSearch}
                onChange={(e) => setActorSearch(e.target.value)}
              />

              {actorSearch.trim().length > 0 && (
                <div className="actor-dropdown">
                  {actoresFiltrados.length === 0 ? (
                    <p className="actor-dropdown-empty">Sin resultados</p>
                  ) : (
                    actoresFiltrados.slice(0, 8).map((actor) => (
                      <button
                        key={actor.id}
                        type="button"
                        className="actor-dropdown-item"
                        onClick={() => {
                          handleActorToggle(actor.id);
                          setActorSearch("");
                        }}
                      >
                        {actor.nombre}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Plataformas</label>

              <div className="platforms-grid">
                {Object.entries(PLATFORM_MAP).map(([key, { name, logo }]) => {
                  const selected = form.plataformas?.split("-").includes(key);

                  return (
                    <label
                      key={key}
                      className={`platform-item ${
                        selected ? "platform-item--selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => {
                          setForm((prev) => {
                            const current = prev.plataformas
                              ? prev.plataformas.split("-").filter(Boolean)
                              : [];

                            const updated = current.includes(key)
                              ? current.filter((k) => k !== key)
                              : [...current, key];

                            return {
                              ...prev,
                              plataformas: updated.join("-"),
                            };
                          });
                        }}
                        className="platform-checkbox"
                      />
                      <img src={logo} alt={name} className="platform-logo" />
                      <span className="platform-name">{name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="file-section">
              <div className="form-group">
                <label>Portada</label>

                {existingPortada && !portada && (
                  <div className="portada-item">
                    <div className="portada-item__preview">
                      <img
                        src={existingPortada}
                        alt={form.portada_alternativo || "Portada"}
                        className="portada-item__thumb"
                      />
                    </div>

                    <div className="portada-item__info">
                      <span className="portada-item__filename">
                        Portada actual
                      </span>

                      <label className="portada-item__alt-label">
                        Texto alternativo
                      </label>

                      <input
                        type="text"
                        className="portada-item__alt-input"
                        value={form.portada_alternativo}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            portada_alternativo: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="portada-item__remove"
                      onClick={handleDeleteCurrentPortada}
                    >
                      ×
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setPortada(file);
                      setPortadaRemoved(false);
                    }
                  }}
                />

                {portada && (
                  <div className="portada-item">
                    <div className="portada-item__preview">
                      <img
                        src={URL.createObjectURL(portada)}
                        alt={form.portada_alternativo || "Nueva portada"}
                        className="portada-item__thumb"
                      />
                    </div>

                    <div className="portada-item__info">
                      <span className="portada-item__filename">
                        {portada.name}
                      </span>

                      <label className="portada-item__alt-label">
                        Texto alternativo
                      </label>

                      <input
                        type="text"
                        className="portada-item__alt-input"
                        value={form.portada_alternativo}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            portada_alternativo: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="portada-item__remove"
                      onClick={() => setPortada(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group trailer-upload-group">
                <label>Trailer</label>

                {existingTrailer && !trailerPreview && (
                  <>
                    <video
                      src={existingTrailer}
                      controls
                      className="trailer-preview-video"
                    />
                    <p className="media-hint">
                      Selecciona un nuevo archivo para reemplazar el trailer
                      actual.
                    </p>
                  </>
                )}

                {trailerPreview && (
                  <video
                    src={trailerPreview}
                    controls
                    className="trailer-preview-video"
                  />
                )}

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setTrailerFile(file);
                      setTrailerPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {trailerFile && (
                  <div className="trailer-file-info">
                    <span className="file-badge">video</span>
                    <span className="trailer-file-name">
                      {trailerFile.name}
                    </span>
                    <button
                      type="button"
                      className="trailer-remove-btn"
                      onClick={() => {
                        setTrailerFile(null);
                        setTrailerPreview(null);
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {existingMedia.length > 0 && (
                <div className="form-group">
                  <label>Contenido multimedia actual</label>

                  <div className="media-list">
                    {existingMedia.map((item) => (
                      <div key={item.id} className="media-item">
                        <div className="media-item__preview">
                          {/\.(mp4|webm|ogg|mov)$/i.test(item.contenido) ? (
                            <video
                              src={item.contenido}
                              controls
                              className="media-item__thumb"
                            />
                          ) : (
                            <img
                              src={item.contenido}
                              alt={item.alternativo || ""}
                              className="media-item__thumb"
                            />
                          )}
                        </div>

                        <div className="media-item__info">
                          <span className="media-item__filename">
                            Archivo existente
                          </span>

                          <label className="media-item__alt-label">
                            Texto alternativo
                          </label>

                          <input
                            type="text"
                            className="media-item__alt-input"
                            value={item.alternativo || ""}
                            onChange={(e) => {
                              const value = e.target.value;

                              setExistingMedia((prev) =>
                                prev.map((m) =>
                                  m.id === item.id
                                    ? { ...m, alternativo: value }
                                    : m
                                )
                              );
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="media-item__remove"
                          onClick={() => openDeleteMediaModal(item)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Añadir nuevo contenido multimedia</label>

                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaFilesChange}
                />

                {mediaFiles.length > 0 && (
                  <div className="media-list">
                    {mediaFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="media-item">
                        <div className="media-item__info">
                          <span className="media-item__filename">
                            {file.name}
                          </span>

                          <label className="media-item__alt-label">
                            Texto alternativo
                          </label>

                          <input
                            type="text"
                            className="media-item__alt-input"
                            value={mediaAlts[index] || ""}
                            onChange={(e) =>
                              setMediaAlts((prev) => ({
                                ...prev,
                                [index]: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <button
                          type="button"
                          className="media-item__remove"
                          onClick={() => removeNewMediaFile(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {status && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>

      {showDeleteMediaModal && (
        <div className="delete-modal-overlay" role="dialog" aria-modal="true">
          <div className="delete-modal">
            <h2 className="delete-modal-title">¿Eliminar multimedia?</h2>

            <p className="delete-modal-body">
              Esta acción eliminará este archivo multimedia permanentemente. No
              se puede deshacer.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="home-btn secondary"
                onClick={closeDeleteMediaModal}
                disabled={deletingMedia}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="home-btn danger"
                onClick={confirmDeleteExistingMedia}
                disabled={deletingMedia}
              >
                {deletingMedia ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AccessibilityButton />
    </div>
  );
}