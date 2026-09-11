import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../css/Pelicula.css";
import AccessibilityButton from "../components/boton_accesibilidad";

import netflixLogo from "../img/netflix.png";
import primeLogo from "../img/prime.png";
import hboLogo from "../img/hbo.png";
import disneyLogo from "../img/disney.png";
import appleLogo from "../img/apple.png";
import movistarLogo from "../img/movistar.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PLATFORM_MAP = {
  n: { name: "Netflix", logo: netflixLogo },
  p: { name: "Prime Video", logo: primeLogo },
  h: { name: "HBO Max", logo: hboLogo },
  d: { name: "Disney+", logo: disneyLogo },
  a: { name: "Apple TV+", logo: appleLogo },
  m: { name: "Movistar+", logo: movistarLogo },
};

const AGE_BADGE = {
  0:  { label: "TP",  cls: "age-tp"  },
  12: { label: "+12", cls: "age-12"  },
  16: { label: "+16", cls: "age-16"  },
  18: { label: "+18", cls: "age-18"  },
};

const getAgeBadge = (age) => {
  const n = Number(age);
  if (!n || n < 12) return AGE_BADGE[0];
  if (n < 16)       return AGE_BADGE[12];
  if (n < 18)       return AGE_BADGE[16];
  return              AGE_BADGE[18];
};

const renderStars = (n) => {
  const v = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★".repeat(v) + "☆".repeat(5 - v);
};

const getAuthorName = (comment, currentUser, currentPerfilId) => {
  const p = comment.Perfiles;

  if (p?.nombre) {
    return `${p.nombre}${p.apellidos ? " " + p.apellidos : ""}`;
  }

  if (
    currentPerfilId &&
    comment.usuario === currentPerfilId &&
    currentUser
  ) {
    return currentUser.email?.split("@")[0] || "Tú";
  }

  return "Anónimo";
};

const getYouTubeId = (url) => {
  if (!url) return null;

  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );

  return m ? m[1] : null;
};

const getVimeoId = (url) => {
  if (!url) return null;

  const m = url.match(/vimeo\.com\/(\d+)/);

  return m ? m[1] : null;
};

// ── Star selector ──────────────────────────────────────────────────────────
const StarSelector = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-selector" role="group" aria-label="Valoración">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`star-sel-btn ${
            s <= (hover || value) ? "active" : ""
          }`}
          onClick={() => onChange(s === value ? 0 : s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} estrella${s > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const Pelicula = () => {
  const { id } = useParams();
  const { user, tipo } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFilm, setDeletingFilm] = useState(false);

  const [categories, setCategories] = useState([]);
  const [film, setFilm]       = useState(null);
  const [media, setMedia]     = useState([]);
  const [actores, setActores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [directores, setDirectores] = useState([]);

  // Perfil del usuario
  const [userPerfilId, setUserPerfilId] = useState(null);

  // Calificación
  const [userRating,    setUserRating]    = useState(0);
  const [savedRating,   setSavedRating]   = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMsg,     setRatingMsg]     = useState("");

  // Comentarios
  const [comments,        setComments]       = useState([]);
  const [commentText,     setCommentText]    = useState("");
  const [commentStars,    setCommentStars]   = useState(0);
  const [submitting,      setSubmitting]     = useState(false);
  const [commentError,    setCommentError]   = useState("");
  const [commentSuccess,  setCommentSuccess] = useState(false);
  const [editingComment,  setEditingComment] = useState(null);
  const [editText,        setEditText]       = useState("");
  const [editStars,       setEditStars]      = useState(0);

  // ── Cargar datos de película ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [filmRes, mediaRes, commentsRes, actoresRes, directoresRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/films/${id}`),
            fetch(`${API_BASE}/api/films/${id}/media`),
            fetch(`${API_BASE}/api/comentarios/film/${id}`),
            fetch(`${API_BASE}/api/actores/film/${id}`),
            fetch(`${API_BASE}/api/directorFilm/films/${id}/directores`),

          ]);

        if (!filmRes.ok) {
          throw new Error("No se pudo cargar la película");
        }

        setDirectores(directoresRes.ok ? await directoresRes.json() : []);
        setFilm(await filmRes.json());
        setMedia(mediaRes.ok ? await mediaRes.json() : []);
        setComments(commentsRes.ok ? await commentsRes.json() : []);
        setActores(actoresRes.ok ? await actoresRes.json() : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ── Cargar perfil + calificación del usuario ─────────────────────────────
  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/api/perfiles/${user.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;

        setUserPerfilId(data.id);

        return fetch(
          `${API_BASE}/api/calificaciones/${id}/${data.id}`
        );
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((cal) => {
        if (cal) {
          setSavedRating(cal.puntuacion);
          setUserRating(cal.puntuacion);
        }
      })
      .catch(() => {});
  }, [user, id]);

  // ── Handlers calificación ────────────────────────────────────────────────
  const handleSaveRating = async () => {
    if (!userPerfilId || userRating === 0) return;

    setRatingLoading(true);
    setRatingMsg("");

    try {
      const method =
        savedRating !== null ? "PUT" : "POST";

      const url =
        savedRating !== null
          ? `${API_BASE}/api/calificaciones/${id}/${userPerfilId}`
          : `${API_BASE}/api/calificaciones`;

      const body =
        savedRating !== null
          ? { puntuacion: userRating }
          : {
              pelicula: Number(id),
              usuario: userPerfilId,
              puntuacion: userRating,
            };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error();
      }

      setSavedRating(userRating);

      setRatingMsg(
        savedRating !== null
          ? "Calificación actualizada."
          : "¡Calificación guardada!"
      );

      setTimeout(() => setRatingMsg(""), 3000);
    } catch {
      setRatingMsg("No se pudo guardar la calificación.");
    } finally {
      setRatingLoading(false);
    }
  };
  useEffect(() => {
    fetch(`${API_BASE}/api/categorias`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  // ── Comentarios ──────────────────────────────────────────────────────────
  const myComment = userPerfilId
    ? comments.find((c) => c.usuario === userPerfilId)
    : null;

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!userPerfilId) return;

    if (!commentText.trim()) {
      setCommentError("Escribe un comentario.");
      return;
    }

    setSubmitting(true);
    setCommentError("");

    try {
      const body = {
        usuario: userPerfilId,
        pelicula: Number(id),
        comentariol: commentText.trim(),
      };

      const res = await fetch(`${API_BASE}/api/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(
          data.error || "No se pudo guardar el comentario."
        );
      }

      const newComment = await res.json();

      setComments((prev) => [newComment, ...prev]);

      setCommentText("");
      setCommentSuccess(true);

      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
    
  };
  const handleDeleteFilm = async () => {
    setDeletingFilm(true);
    try {
      const res = await fetch(`${API_BASE}/api/films/${film.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo eliminar la película.");
      }

      navigate("/");
    } catch (err) {
      setShowDeleteModal(false);
      setError(err.message);
    } finally {
      setDeletingFilm(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/comentarios/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setComments((prev) =>
        prev.filter((c) => c.id !== commentId)
      );
    } catch {}
  };

  const startEdit = (c) => {
    setEditingComment(c.id);
    setEditText(c.comentariol || "");
  };

  const handleEditComment = async (commentId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/comentarios/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comentariol: editText.trim(),
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const updated = await res.json();

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, ...updated }
            : c
        )
      );

      setEditingComment(null);
    } catch {}
  };

  // ── Helpers multimedia ───────────────────────────────────────────────────
  const isVideo = (url) =>
    /\.(mp4|webm|ogg|mov)$/i.test(url);

  const isImage = (url) =>
    /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url);

  // ── Render trailer ───────────────────────────────────────────────────────
  const renderTrailer = (url) => {
    if (!url) return null;

    const ytId    = getYouTubeId(url);
    const vimeoId = getVimeoId(url);

    const isLocal =
      /\.(mp4|webm|ogg|mov)$/i.test(url);

    if (ytId) {
      return (
        <div className="trailer-embed">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title="Tráiler"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (vimeoId) {
      return (
        <div className="trailer-embed">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Tráiler"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (isLocal) {
      return (
        <video controls className="trailer-video">
          <source src={url} />
          Tu navegador no soporta la reproducción de vídeo.
        </video>
      );
    }

    return null;
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <p className="pel-msg" role="status">
        Cargando película...
      </p>
    );
  }

  if (error) {
    return (
      <p className="pel-msg pel-error" role="alert">
        {error}
      </p>
    );
  }

  if (!film) return null;

  const ageBadge =
    film.edad_recomendada != null
      ? getAgeBadge(film.edad_recomendada)
      : null;

  const platforms = film.plataformas
    ? film.plataformas.split("-").filter(Boolean)
    : [];

  const otherComments = comments.filter(
    (c) => c.usuario !== userPerfilId
  );

  // ── Siempre mostrar info adicional ──────────────────────────────────────
  const additionalFields = [
    {
      label: "Duración",
      value: film.duracion
        ? `${film.duracion} min`
        : "No disponible",
    },
    {
      label: "País de producción",
      value:
        film.pais_produccion || "No disponible",
    },
    {
      label: "Idioma original",
      value:
        film.idioma_original || "No disponible",
    },
    {
      label: "Estado",
      value: film.estado || "No disponible",
    },
  ];



  return (
    <div className="pel-wrapper">
      <Navbar />

      <nav
        className="pel-breadcrumb"
        aria-label="Ruta de navegación"
      >
        <ol>
          <li>
            <Link to="/">Inicio</Link>
          </li>

          <li>
            <span aria-current="page">
              {film.titulo}
            </span>
          </li>
        </ol>
      </nav>

      <main className="pel-main" id="main-content">

        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <article className="pel-card pel-hero">

          <aside className="pel-poster-col">
            {film.img_portada ? (
              <img
                src={film.img_portada}
                alt={`Portada de ${film.titulo}`}
                className="pel-poster"
                width="160"
                height="240"
                loading="lazy"
              />
            ) : (
              <div
                className="pel-poster-placeholder"
                role="img"
                aria-label="Sin imagen"
              >
                Sin imagen
              </div>
            )}
          </aside>

          <div className="pel-info-col">

            <div className="pel-title-row">
              <h1 className="pel-title">
                {film.titulo}
              </h1>

                {user && tipo === "admin" && (
                  <div className="admin-movie-actions">
                    <button
                      type="button"
                      className="edit-movie-btn"
                      onClick={() => navigate(`/peliculas/editar/${film.id}`)}
                    >
                      Editar película
                    </button>

                    <button
                      type="button"
                      className="delete-movie-btn"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Eliminar película
                    </button>
                  </div>
                )}
              </div>
            

            {film.fecha_publicacion && (
              <p className="pel-year">
                {film.fecha_publicacion}
              </p>
            )}

            {film.sinopsis && (
              <p className="pel-sinopsis">
                {film.sinopsis}
              </p>
            )}

            {directores.length > 0 && (
              <dl className="pel-meta">
                <dt>{directores.length === 1 ? "Director" : "Directores"}</dt>
                {directores.map(({ Directores: d }) =>
                  d ? (
                    <dd key={d.id}>
                      <Link to={`/directores/${d.id}`}>
                        {d.nombre}
                      </Link>
                    </dd>
                  ) : null
                )}
              </dl>
            )}

          </div>

        </article>

        {/* ── 2. Información adicional ─────────────────────────── */}
        <section className="pel-card">

          <h2 className="pel-card-title">
            Información adicional:
          </h2>

          <div className="pel-info-grid">

            {additionalFields.map(({ label, value }) => (
              <div
                key={label}
                className="pel-info-item"
              >
                <span className="pel-info-label">
                  {label}:
                </span>

                <span className="pel-info-value">
                  {value}
                </span>
              </div>
            ))}

          </div>

        </section>

        {/* ── Categorías ───────────────────────────────────────── */}
        <section className="pel-card">

          <h2 className="pel-card-title">
            Categorías:
          </h2>

          <div className="pel-tags">
          {film.Categoria_Film?.length > 0 ? (
            film.Categoria_Film.map((c) => (
              <span key={c.categoria_id} className="pel-tag">
                {c.Categorias?.categoria || "No disponible"}
              </span>
            ))
          ) : (
            <span className="pel-tag pel-tag-empty">No disponible</span>
          )}

          </div>

        </section>

        {/* ── 4. Plataformas ───────────────────────────────────── */}
        {platforms.length > 0 && (
          <section className="pel-card">

            <h2 className="pel-card-title">
              Disponible en:
            </h2>
            <h3 className="pel-card-subtitle">Plataformas donde puedes ver el contenido:</h3>
            <div className="pel-platforms">

              {platforms.map((key) => {
                const plat = PLATFORM_MAP[key];

                if (!plat) return null;

                return (
                  <div
                    key={key}
                    className="pel-plat-item"
                  >
                    <img
                      src={plat.logo}
                      alt={plat.name}
                      className="pel-plat-logo"
                    />

                    <span className="pel-plat-name">
                      {plat.name}
                    </span>
                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* ── 5. Reparto ───────────────────────────────────────── */}
        {actores.length > 0 && (
          <section className="pel-card">

            <h2 className="pel-card-title">
              Reparto
            </h2>

            <div className="pel-actors">

              {actores.map((actor) => (
                <Link
                  key={actor.id}
                  to={`/actores/${actor.id}`}
                  className="pel-actor-card"
                >

                  {actor.foto_perfil ? (
                    <img
                      src={actor.foto_perfil}
                      alt={actor.nombre}
                      className="pel-actor-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="pel-actor-initials">
                      {actor.nombre
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <p className="pel-actor-name">
                    {actor.nombre}
                  </p>

                  {actor.rol && (
                    <p className="pel-actor-rol">
                      {actor.rol}
                    </p>
                  )}

                </Link>
              ))}

            </div>

          </section>
        )}
        {/* ── Calificación media ───────────────────────────────── */}
        {film.calificacion != null && (
          <section className="pel-card">
            <h2 className="pel-card-title">Calificación del Público:</h2>
            <div className="star-rating static">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star-btn ${film.calificacion >= star ? "active" : ""}`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
              ))}
              <span className="star-value" aria-label={`${film.calificacion} de 5`}>
                {film.calificacion} / 5
              </span>
            </div>
          </section>
        )}
        {/* ── 6. Calificación ──────────────────────────────────── */}
        {user && (
          <section className="pel-card">

            <h2 className="pel-card-title">
              Tu calificación
            </h2>

            <div className="pel-rating-inner">

              {savedRating !== null && (
                <div className="pel-rating-current">

                  <span className="pel-rating-current-label">
                    Tu puntuación actual
                  </span>

                  <span className="pel-rating-current-stars">
                    {renderStars(savedRating)}
                  </span>

                </div>
              )}

              <StarSelector
                value={userRating}
                onChange={setUserRating}
              />

              <button
                type="button"
                className="pel-rating-btn"
                onClick={handleSaveRating}
                disabled={
                  ratingLoading || userRating === 0
                }
              >
                {ratingLoading
                  ? "Guardando..."
                  : savedRating !== null
                  ? "Actualizar calificación"
                  : "Añadir calificación"}
              </button>

              {ratingMsg && (
                <p className="pel-rating-msg">
                  {ratingMsg}
                </p>
              )}

            </div>

          </section>
        )}

        {/* ── 7. Trailer ───────────────────────────────────────── */}
        {film.trailer &&
          renderTrailer(film.trailer) && (
            <section className="pel-card">

              <h2 className="pel-card-title">
                Tráiler:
              </h2>

              {renderTrailer(film.trailer)}

            </section>
          )}

        {/* ── 8. Multimedia ────────────────────────────────────── */}
        {media.length > 0 && (
          <section className="pel-card">

            <h2 className="pel-card-title">
              Multimedia
            </h2>

            <div className="pel-media-grid">

              {media.map((item) => (
                <figure
                  key={item.id}
                  className="pel-media-item"
                >

                  {isVideo(item.contenido) ? (
                    <video
                      controls
                      className="pel-media-video"
                    >
                      <source
                        src={item.contenido}
                      />
                    </video>
                  ) : isImage(item.contenido) ? (
                    <img
                      src={item.contenido}
                      alt={
                        item.alternativo ||
                        `Imagen de ${film.titulo}`
                      }
                      className="pel-media-img"
                      loading="lazy"
                    />
                  ) : (
                    <a
                      href={item.contenido}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver archivo
                    </a>
                  )}

                </figure>
              ))}

            </div>

          </section>
        )}

        {/* ── 9. Comentarios ───────────────────────────────────── */}
        <section className="pel-card">

          <h2 className="pel-card-title">
            Comentarios

            {comments.length > 0 && (
              <span className="pel-comment-count">
                {comments.length}
              </span>
            )}
          </h2>

          {/* Formulario */}
          {user ? (
            myComment ? (
              <div className="pel-my-comment">

                <p className="pel-my-comment-label">
                  Tu comentario
                </p>

                {editingComment === myComment.id ? (
                  <div className="pel-comment-edit">

                    <textarea
                      className="pel-textarea"
                      value={editText}
                      onChange={(e) =>
                        setEditText(e.target.value)
                      }
                      rows={3}
                      maxLength={1000}
                    />

                    <div className="pel-comment-edit-actions">

                      <button
                        type="button"
                        className="pel-btn-primary"
                        onClick={() =>
                          handleEditComment(
                            myComment.id
                          )
                        }
                      >
                        Guardar cambios
                      </button>

                      <button
                        type="button"
                        className="pel-btn-ghost"
                        onClick={() =>
                          setEditingComment(null)
                        }
                      >
                        Cancelar
                      </button>

                    </div>

                  </div>
                ) : (
                  <div className="pel-my-comment-body">

                    {myComment.comentariol && (
                      <p className="pel-coment-text">
                        {myComment.comentariol}
                      </p>
                    )}

                    <div className="pel-my-comment-actions">

                      <button
                        type="button"
                        className="pel-btn-ghost"
                        onClick={() =>
                          startEdit(myComment)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="pel-btn-danger"
                        onClick={() =>
                          handleDeleteComment(
                            myComment.id
                          )
                        }
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ) : (
              <form
                className="pel-comment-form"
                onSubmit={handleSubmitComment}
              >

                <textarea
                  className="pel-textarea"
                  placeholder="Escribe tu comentario sobre esta película..."
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  rows={4}
                  maxLength={1000}
                />

                {commentError && (
                  <p className="pel-form-error">
                    {commentError}
                  </p>
                )}

                {commentSuccess && (
                  <p className="pel-form-success">
                    ¡Comentario publicado!
                  </p>
                )}

                <button
                  type="submit"
                  className="pel-btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Publicando..."
                    : "Publicar comentario"}
                </button>

              </form>
            )
          ) : (
            <div className="pel-login-prompt">

              <p>
                ¿Quieres comentar esta película?
              </p>

              <Link
                to="/login"
                className="pel-btn-primary"
              >
                Iniciar sesión
              </Link>

            </div>
          )}

          {/* Lista comentarios */}
          {otherComments.length === 0 &&
          !myComment ? (
            <p className="pel-comment-empty">
              Todavía no hay comentarios.
              ¡Sé el primero!
            </p>
          ) : otherComments.length > 0 ? (
            <ul className="pel-comment-list">

              {otherComments.map((c) => {
                const name = getAuthorName(
                  c,
                  user,
                  userPerfilId
                );

                const foto =
                  c.Perfiles?.foto_perfil;

                return (
                  <li
                    key={c.id}
                    className="pel-comment-item"
                  >

                    <div className="pel-comment-avatar">

                      {foto ? (
                        <img
                          src={foto}
                          alt={name}
                          className="pel-comment-avatar-img"
                        />
                      ) : (
                        name
                          .charAt(0)
                          .toUpperCase()
                      )}

                    </div>

                    <div className="pel-comment-body">

                      <div className="pel-comment-header">

                        <span className="pel-comment-author">
                          {name}
                        </span>

                      </div>

                      {c.comentariol && (
                        <p className="pel-coment-text">
                          {c.comentariol}
                        </p>
                      )}

                    </div>

                  </li>
                );
              })}

            </ul>
          ) : null}

        </section>
        {/* ── Modal eliminar película ──────────────────────────────── */}
        {showDeleteModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-box">
              <h2 id="modal-title" className="modal-title">¿Eliminar película?</h2>
              <p className="modal-desc">
                Esta acción eliminará <strong>{film.titulo}</strong> y todos sus archivos multimedia de forma permanente. No se puede deshacer.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="pel-btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deletingFilm}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="pel-btn-danger"
                  onClick={handleDeleteFilm}
                  disabled={deletingFilm}
                >
                  {deletingFilm ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <AccessibilityButton />

    </div>
  );
};

export default Pelicula;