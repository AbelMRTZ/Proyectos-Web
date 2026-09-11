import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

// ─── Validation helpers ────────────────────────────────────────────────────
const PLATFORM_MAP = {
  n: { name: "Netflix", logo: netflixLogo },
  p: { name: "Prime Video", logo: primeLogo },
  h: { name: "HBO Max", logo: hboLogo },
  d: { name: "Disney+", logo: disneyLogo },
  a: { name: "Apple TV+", logo: appleLogo },
  m: { name: "Movistar+", logo: movistarLogo },
};

const REQUIRED_FIELDS = {
  titulo: "El título es obligatorio",
  sinopsis: "La sinopsis es obligatoria",
  fecha_publicacion: "La fecha de estreno es obligatoria",
};

const validateForm = (form, portada, portadaAlt, mediaFiles, mediaAlts, trailerFile) => {
  const errors = {};

  // Required text fields
  Object.entries(REQUIRED_FIELDS).forEach(([field, msg]) => {
    if (!form[field] || !String(form[field]).trim()) {
      errors[field] = msg;
    }
  });

  // At least one category
  if (form.categoria.length === 0) {
    errors.categoria = "Selecciona al menos una categoría";
  }

  // Alt text for portada (only if a portada file is selected)
  if (portada && (!portadaAlt || !portadaAlt.trim())) {
    errors.portadaAlt = "El texto alternativo de la portada es obligatorio";
  }

  // Portada obligatoria
  if (!portada) {
    errors.portada = "La imagen de portada es obligatoria";
  }

  // Trailer obligatorio  
  if (!trailerFile) {
    errors.trailer = "El trailer es obligatorio";
  }

  // Al menos una plataforma
  if (!form.plataformas || form.plataformas.trim() === "") {
    errors.plataformas = "Selecciona al menos una plataforma de streaming";
  }

  // Alt text for every media file
  const altErrors = {};
  Array.from(mediaFiles).forEach((_, idx) => {
    if (!mediaAlts[idx] || !mediaAlts[idx].trim()) {
      altErrors[idx] = "El texto alternativo es obligatorio";
    }
  });
  if (Object.keys(altErrors).length > 0) {
    errors.mediaAlts = altErrors;
  }

  return errors;
};

// ─── FieldError component ──────────────────────────────────────────────────

const FieldError = ({ message }) =>
  message ? (
    <span className="field-error" role="alert">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" />
      </svg>
      {message}
    </span>
  ) : null;

// ─── PortadaItem component ─────────────────────────────────────────────────
// Misma estructura visual que MediaFileItem pero para la portada

const PortadaItem = ({ file, alt, altError, onAltChange, onRemove }) => {
  const previewUrl = useRef(URL.createObjectURL(file)).current;

  return (
    <div className={`portada-item ${altError ? "portada-item--error" : ""}`}>
      {/* Preview */}
      <div className="portada-item__preview">
        <img
          src={previewUrl}
          alt={alt || "Preview portada"}
          className="portada-item__thumb"
        />
        <span className="portada-item__badge">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v6.5l3-2.5 2.5 2 2-1.5L13 9.5V3H3zm0 10h10v-1.5l-2.5-2-2 1.5-2.5-2L3 11.5V13zM6 6.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          portada
        </span>
      </div>

      {/* Info + alt input */}
      <div className="portada-item__info">
        <span className="portada-item__filename" title={file.name}>
          {file.name}
        </span>
        <span className="portada-item__size">
          {(file.size / (1024 * 1024)).toFixed(1)} MB
        </span>

        <label className="portada-item__alt-label">
          Texto alternativo <span className="required-star">*</span>
        </label>
        <input
          type="text"
          className={`portada-item__alt-input ${altError ? "input--error" : ""}`}
          placeholder="Describe brevemente la imagen de portada…"
          value={alt}
          onChange={(e) => onAltChange(e.target.value)}
          aria-invalid={!!altError}
          aria-describedby={altError ? "portada-alt-error" : undefined}
        />
        {altError && <FieldError message={altError} />}
      </div>

      {/* Remove */}
      <button
        type="button"
        className="portada-item__remove"
        onClick={onRemove}
        aria-label={`Quitar ${file.name}`}
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
        </svg>
      </button>
    </div>
  );
};

// ─── MediaFileItem component ───────────────────────────────────────────────

const MediaFileItem = ({ file, index, alt, altError, onAltChange, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const previewUrl = useRef(URL.createObjectURL(file)).current;

  return (
    <div className={`media-item ${altError ? "media-item--error" : ""}`}>
      <div className="media-item__preview">
        {isImage && (
          <img src={previewUrl} alt={alt || `Archivo ${index + 1}`} className="media-item__thumb" />
        )}
        {isVideo && (
          <video src={previewUrl} className="media-item__thumb media-item__thumb--video" muted />
        )}
        <span className={`media-item__badge media-item__badge--${isImage ? "image" : "video"}`}>
          {isImage ? (
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v6.5l3-2.5 2.5 2 2-1.5L13 9.5V3H3zm0 10h10v-1.5l-2.5-2-2 1.5-2.5-2L3 11.5V13zM6 6.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 4a1 1 0 011-1h7a1 1 0 011 1v1.382l2.447-1.223A.5.5 0 0114 4.618v6.764a.5.5 0 01-.553.497L11 10.618V12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
            </svg>
          )}
          {isImage ? "imagen" : "vídeo"}
        </span>
      </div>

      <div className="media-item__info">
        <span className="media-item__filename" title={file.name}>
          {file.name}
        </span>
        <span className="media-item__size">
          {(file.size / (1024 * 1024)).toFixed(1)} MB
        </span>

        <label className="media-item__alt-label">
          Texto alternativo <span className="required-star">*</span>
        </label>
        <input
          type="text"
          className={`media-item__alt-input ${altError ? "input--error" : ""}`}
          placeholder="Describe brevemente este archivo…"
          value={alt}
          onChange={(e) => onAltChange(index, e.target.value)}
          aria-invalid={!!altError}
          aria-describedby={altError ? `alt-error-${index}` : undefined}
        />
        {altError && <FieldError message={altError} />}
      </div>

      <button
        type="button"
        className="media-item__remove"
        onClick={() => onRemove(index)}
        aria-label={`Quitar ${file.name}`}
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
        </svg>
      </button>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

export default function CrearPelicula() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    estado: "activo",
    plataformas: "",
  });

  const [categories, setCategories] = useState([]);
  const [actores, setActores] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [actorSearch, setActorSearch] = useState("");
  const [directorSearch, setDirectorSearch] = useState("");
  const [directorSeleccionado, setDirectorSeleccionado] = useState(null);

  // ── Portada + su alt text ──────────────────────────────────────────────────
  const [portada, setPortada] = useState(null);
  const [portadaAlt, setPortadaAlt] = useState("");

  // ── Multimedia ─────────────────────────────────────────────────────────────
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaAlts, setMediaAlts] = useState({});

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailerFile, setTrailerFile] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // ── Fetch data ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
      return;
    }

    const checkAdminAndLoad = async () => {
      try {
        const perfilRes = await fetch(`${API_BASE}/api/perfiles/${user.id}`);

        if (!perfilRes.ok) {
          navigate("/");
          return;
        }

        const perfilData = await perfilRes.json();

        const isAdmin =
          String(perfilData.tipo).trim().toLowerCase() === "admin";

        if (!isAdmin) {
          navigate("/");
          return;
        }

        const [categoriesRes, actoresRes, directoresRes] = await Promise.all([
          fetch(CATEGORIES_URL),
          fetch(`${ACTORES_URL}?limit=200`),
          fetch(DIRECTORES_URL),
        ]);

        setCategories(await categoriesRes.json());
        setActores(await actoresRes.json());
        setDirectores(await directoresRes.json());

        setCheckingAdmin(false);
      } catch (err) {
        navigate("/");
      }
    };

    checkAdminAndLoad();
  }, [user, navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const alreadySelected = prev.categoria.includes(value);
      const newCategoria = alreadySelected
        ? prev.categoria.filter((c) => c !== value)
        : [...prev.categoria, value];
      return { ...prev, categoria: newCategoria };
    });
    if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
  };

  const handleActorToggle = (id) => {
    const strId = String(id);
    setForm((prev) => ({
      ...prev,
      actores: prev.actores.includes(strId)
        ? prev.actores.filter((a) => a !== strId)
        : [...prev.actores, strId],
    }));
  };

  const removeActor = (id) =>
    setForm((prev) => ({
      ...prev,
      actores: prev.actores.filter((a) => a !== String(id)),
    }));

    const selectDirector = (director) => {
      setDirectorSeleccionado(director);
      setForm((prev) => ({ ...prev, director_id: director.id })); // ✅
      setDirectorSearch("");
    };

    const removeDirector = () => {
      setDirectorSeleccionado(null);
      setForm((prev) => ({ ...prev, director_id: null })); // ✅
    };

  // ── Portada handlers ──────────────────────────────────────────────────────

  const handlePortadaChange = (file) => {
    setPortada(file ?? null);
    setPortadaAlt("");
    if (errors.portadaAlt) setErrors((prev) => ({ ...prev, portadaAlt: undefined }));
  };

  const handlePortadaAltChange = (value) => {
    setPortadaAlt(value);
    if (errors.portadaAlt) setErrors((prev) => ({ ...prev, portadaAlt: undefined }));
  };

  const removePortada = () => {
    setPortada(null);
    setPortadaAlt("");
    setErrors((prev) => ({ ...prev, portadaAlt: undefined }));
  };

  // ── Media file handlers ───────────────────────────────────────────────────

  const handleMediaFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAltChange = (index, value) => {
    setMediaAlts((prev) => ({ ...prev, [index]: value }));
    if (errors.mediaAlts?.[index]) {
      setErrors((prev) => ({
        ...prev,
        mediaAlts: { ...prev.mediaAlts, [index]: undefined },
      }));
    }
  };

  const removeMediaFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaAlts((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < index) updated[ki] = v;
        else if (ki > index) updated[ki - 1] = v;
      });
      return updated;
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const validationErrors = validateForm(form, portada, portadaAlt, mediaFiles, mediaAlts, trailerFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = document.querySelector(".input--error, .checkbox-group--error, .field-error");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else if (value) {
        formData.append(key, value);
      }
    });
    
    if (form.director_id) {
      formData.append("directores[]", form.director_id);
    }

    if (portada) {
      formData.append("portada", portada);
      // El alt text de portada viaja como campo de texto en el body
      formData.append("portada_alternativo", portadaAlt.trim());
    }

    if (trailerFile) formData.append("trailer", trailerFile);

    mediaFiles.forEach((file, index) => {
      formData.append("files", file);
      formData.append("files_alt[]", mediaAlts[index] || "");
    });

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error desconocido");

      setStatus({
        type: "success",
        message: `Película "${json.movie.titulo}" creada con éxito. ID: ${json.movie.id}`,
      });
      navigate(`/pelicula/${json.movie.id}`);

      // Reset
      setForm({
        titulo: "", sinopsis: "", fecha_publicacion: "",
        edad_recomendada: "", director: "", calificacion: "",
        pais_produccion: "", duracion: "", idioma_original: "",
        categoria: [], actores: [], estado: "activo", plataformas: "",
      });
      setPortada(null);
      setPortadaAlt("");
      setMediaFiles([]);
      setMediaAlts({});
      setActorSearch("");
      setDirectorSearch("");
      setDirectorSeleccionado(null);
      setTrailerFile(null);
      setTrailerPreview(null);
      setErrors({});
      e.target.reset();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Filtered lists ────────────────────────────────────────────────────────

  const actoresFiltrados = actores.filter(
    (a) =>
      a.nombre.toLowerCase().includes(actorSearch.toLowerCase()) &&
      !form.actores.includes(String(a.id))
  );
  const actoresSeleccionados = actores.filter((a) => form.actores.includes(String(a.id)));
  const directoresFiltrados = directores.filter(
    (d) =>
      d.nombre.toLowerCase().includes(directorSearch.toLowerCase()) &&
      (!directorSeleccionado || d.id !== directorSeleccionado.id)
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="crear-wrapper">
      <Navbar />

      <div className="crear-hero">
        <div>
          <h1>Añadir nueva película</h1>
          <p className="crear-hero__sub">
            Los campos marcados con <span className="required-star">*</span> son obligatorios
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

            {/* ── Título ── */}
            <div className={`form-group ${errors.titulo ? "form-group--error" : ""}`}>
              <label>
                Título <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="ej. Inception"
                aria-invalid={!!errors.titulo}
                className={errors.titulo ? "input--error" : ""}
              />
              <FieldError message={errors.titulo} />
            </div>

            {/* ── Sinopsis ── */}
            <div className={`form-group ${errors.sinopsis ? "form-group--error" : ""}`}>
              <label>
                Sinopsis <span className="required-star">*</span>
              </label>
              <textarea
                name="sinopsis"
                value={form.sinopsis}
                onChange={handleChange}
                placeholder="Breve descripción de la película..."
                rows={4}
                aria-invalid={!!errors.sinopsis}
                className={errors.sinopsis ? "input--error" : ""}
              />
              <FieldError message={errors.sinopsis} />
            </div>

            {/* ── Fecha + Director ── */}
            <div className="form-row">
              <div className={`form-group ${errors.fecha_publicacion ? "form-group--error" : ""}`}>
                <label>
                  Fecha de estreno <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={form.fecha_publicacion}
                  onChange={handleChange}
                  aria-invalid={!!errors.fecha_publicacion}
                  className={errors.fecha_publicacion ? "input--error" : ""}
                />
                <FieldError message={errors.fecha_publicacion} />
              </div>

              <div className="form-group">
                <label>Director</label>
                {directorSeleccionado ? (
                  <div className="actor-chips">
                    <span className="actor-chip">
                      {directorSeleccionado.nombre}
                      <button
                        type="button"
                        className="actor-chip-remove"
                        onClick={removeDirector}
                        aria-label="Quitar director"
                      >×</button>
                    </span>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      className="actor-search-input"
                      placeholder="Buscar director por nombre..."
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
                              <span>{director.nombre}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Edad recomendada ── */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edad_recomendada">Edad recomendada</label>
                <select
                  id="edad_recomendada"
                  name="edad_recomendada"
                  value={form.edad_recomendada}
                  onChange={handleChange}
                >
                  <option value="0">Todas las edades</option>
                  <option value="3">+3</option>
                  <option value="7">+7</option>
                  <option value="12">+12</option>
                  <option value="16">+16</option>
                  <option value="18">+18</option>
                </select>
              </div>
            </div>

            {/* ── Calificación ── */}
            <div className="form-group">
              <label>Calificación</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${Number(form.calificacion) >= star ? "active" : ""}`}
                    onClick={() => setForm((prev) => ({ ...prev, calificacion: String(star) }))}
                    aria-label={`Calificación ${star}`}
                  >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
                {form.calificacion && (
                  <span className="star-value">{form.calificacion} / 5</span>
                )}
              </div>
            </div>

            {/* ── País + Duración ── */}
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
                <label>Duración (minutos)</label>
                <input
                  type="number"
                  name="duracion"
                  value={form.duracion}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            {/* ── Idioma ── */}
            <div className="form-row">
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

            {/* ── 3. Categorías ───────────────────────────────────────── */}
            <div className={`form-group ${errors.categoria ? "form-group--error" : ""}`}>
              <label>
                Categorías <span className="required-star">*</span>
              </label>
              <div className={`checkbox-group ${errors.categoria ? "checkbox-group--error" : ""}`}>
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
              <FieldError message={errors.categoria} />
            </div>

            {/* ── Actores ── */}
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
                        aria-label={`Quitar ${actor.nombre}`}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                className="actor-search-input"
                placeholder="Buscar actor por nombre..."
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
                        onClick={() => { handleActorToggle(actor.id); setActorSearch(""); }}
                      >
                        <span>{actor.nombre}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {/* ── Plataformas ── */}
            <div className="form-group">
              <label>Plataformas de streaming</label>
              <div className="platforms-grid">
                {Object.entries(PLATFORM_MAP).map(([key, { name, logo }]) => {
                  const selected = form.plataformas?.includes(key);
                  return (
                    <label
                      key={key}
                      className={`platform-item ${selected ? "platform-item--selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        value={key}
                        checked={!!selected}
                        onChange={() => {
                          setErrors(prev => ({ ...prev, plataformas: undefined }));
                          setForm((prev) => {
                            const current = prev.plataformas
                              ? prev.plataformas.split("-").filter(Boolean)
                              : [];

                            const updated = current.includes(key)
                              ? current.filter((k) => k !== key)
                              : [...current, key];

                            return { ...prev, plataformas: updated.join("-") };
                          });
                        }}
                        className="platform-checkbox"
                      />
                      <img src={logo} alt={name} className="platform-logo" />
                      <span className="platform-name">{name}</span>
                      {selected && (
                        <span className="platform-check">
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.354 4.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 01.708-.708L6 11.293l6.646-6.647a.5.5 0 01.708 0z"/>
                          </svg>
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
            <FieldError message={errors.plataformas} />
            {/* ── Estado ── */}
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            {/* ── Trailer ── */}
            <div className="form-group trailer-upload-group">
              <label>Trailer</label>
              <div
                className={`trailer-dropzone ${trailerFile ? "has-file" : ""}`}
                onClick={() => document.getElementById("trailer-input").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();

                  const file = e.dataTransfer.files[0];

                  if (file && file.type.startsWith("video/")) {
                    setTrailerFile(file);
                    setTrailerPreview(URL.createObjectURL(file));

                    setErrors(prev => ({ ...prev, trailer: undefined }));
                  }
                }}
              >
                {trailerPreview ? (
                  <video
                    src={trailerPreview}
                    controls
                    className="trailer-preview-video"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="trailer-dropzone-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span className="trailer-dropzone-title">Arrastra el trailer aquí</span>
                    <span className="trailer-dropzone-sub">o haz clic para seleccionar</span>
                    <span className="trailer-dropzone-formats">MP4 · MOV · AVI — máx. recomendado 500 MB</span>
                  </div>
                )}
              </div>
              <input
                id="trailer-input"
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setTrailerFile(file);
                    setTrailerPreview(URL.createObjectURL(file));

                    setErrors(prev => ({ ...prev, trailer: undefined }));
                  }
                }}
              />
              {trailerFile && (
                <div className="trailer-file-info">
                  <span className="file-badge">video</span>
                  <span className="trailer-file-name">{trailerFile.name}</span>
                  <span className="trailer-file-size">{(trailerFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <button
                    type="button"
                    className="trailer-remove-btn"
                    onClick={() => { setTrailerFile(null); setTrailerPreview(null); }}
                  >Quitar</button>
                </div>
              )}
              <FieldError message={errors.trailer} />
            </div>

            {/* ══════════════════════════════════════════════════════
                SECCIÓN ARCHIVOS — Portada + Multimedia
            ══════════════════════════════════════════════════════ */}
            <div className="file-section">

              {/* ── Portada ── */}
              <div className="form-group">
                <label>
                  Imagen de portada{" "}
                  <span className="label-sub">— se requiere texto alternativo si subes imagen</span>
                </label>
                <p className="media-hint">
                  Si seleccionas una portada, deberás añadir un texto alternativo descriptivo.
                </p>

                {/* Mostrar card con alt-text cuando hay archivo seleccionado */}
                {portada ? (
                  <PortadaItem
                    file={portada}
                    alt={portadaAlt}
                    altError={errors.portadaAlt}
                    onAltChange={handlePortadaAltChange}
                    onRemove={removePortada}
                  />
                ) : (
                  /* Input de selección de archivo (solo visible cuando no hay portada) */
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handlePortadaChange(e.target.files[0] ?? null)}
                  />
                )}
                <FieldError message={errors.portada} />
              </div>

              {/* ── Multimedia con texto alternativo ── */}
              <div className="form-group">
                <label>
                  Archivos multimedia{" "}
                  <span className="label-sub">— imágenes / vídeos</span>
                </label>
                <p className="media-hint">
                  Cada archivo requiere un texto alternativo descriptivo.
                </p>

                <div
                  className="media-dropzone"
                  onClick={() => document.getElementById("media-input").click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setMediaFiles((prev) => [...prev, ...files]);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0L8 8m4-4l4 4" />
                  </svg>
                  <span>Arrastra archivos o haz clic</span>
                  <span className="media-dropzone-sub">JPG, PNG, WEBP, MP4, MOV</span>
                </div>

                <input
                  id="media-input"
                  type="file"
                  accept="image/*,video/mp4,video/quicktime,video/x-msvideo"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleMediaFilesChange}
                />

                {mediaFiles.length > 0 && (
                  <div className="media-list">
                    {mediaFiles.map((file, index) => (
                      <MediaFileItem
                        key={`${file.name}-${index}`}
                        file={file}
                        index={index}
                        alt={mediaAlts[index] || ""}
                        altError={errors.mediaAlts?.[index]}
                        onAltChange={handleAltChange}
                        onRemove={removeMediaFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Status ── */}
            {status && (
              <div className={`status-message ${status.type}`}>
                {status.type === "success" ? (
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.354 5.146a.5.5 0 010 .708l-4 4a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L7 9.793l3.646-3.647a.5.5 0 01.708 0z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" />
                  </svg>
                )}
                {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Subiendo…
                </>
              ) : (
                "Crear Película"
              )}
            </button>
          </form>
        </div>
      </div>
      <AccessibilityButton />
    </div>
  );
}