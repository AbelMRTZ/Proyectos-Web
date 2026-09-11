import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/Perfil.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DUMMY_PROFILE = {
  nombre: "Alex",
  apellidos: "Cinefilo",
  usuario: "alex.cine",
  foto_perfil:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  cabecera:
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1800&auto=format&fit=crop",
};

const DUMMY_RANKING = [
  { pelicula: 1, titulo: "Interstellar", puntuacion: 9.5 },
  { pelicula: 2, titulo: "Whiplash", puntuacion: 9.2 },
  { pelicula: 3, titulo: "Parasite", puntuacion: 8.9 },
  { pelicula: 4, titulo: "Arrival", puntuacion: 8.7 },
  { pelicula: 5, titulo: "Her", puntuacion: 8.4 },
];

const DUMMY_COMMENTS = [
  {
    id: "d1",
    pelicula: 1,
    titulo: "Interstellar",
    img_portada:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop",
    puntuacion: 5,
    comentario:
      "La banda sonora y el tramo final me dejaron clavado en el asiento.",
  },
  {
    id: "d2",
    pelicula: 2,
    titulo: "Whiplash",
    img_portada:
      "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=500&auto=format&fit=crop",
    puntuacion: 4,
    comentario: "Intensa y tensa de principio a fin. Fletcher da miedo real.",
  },
  {
    id: "d3",
    pelicula: 3,
    titulo: "Parasite",
    img_portada:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop",
    puntuacion: 5,
    comentario: "Sutil, divertida y durisima a la vez. Tremenda direccion.",
  },
];

const toStars = (value) => {
  const score = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.round(score);
  return "★".repeat(full) + "☆".repeat(5 - full);
};

const titleColor = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 42%)`;
};

const ScoreRing = ({ score, max = 10 }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Number(score) / max, 1);
  const color = score >= 9 ? "#1a7a3c" : score >= 7 ? "#4caf50" : score >= 5 ? "#f5c518" : score >= 3 ? "#f57c00" : "#b71c1c";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-label={`Puntuación: ${score} de ${max}`}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="27" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
};

const resolveUserKey = (user) => {
  if (!user) return "";
  return user.id;
};

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDummy, setUsingDummy] = useState(false);

  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [comments, setComments] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const visibleComments = useMemo(() => {
    if (comments.length === 0) return [];
    return comments.slice(carouselIndex, carouselIndex + 2);
  }, [comments, carouselIndex]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setProfile(DUMMY_PROFILE);
        setRanking(DUMMY_RANKING);
        setComments(DUMMY_COMMENTS);
        setUsingDummy(true);
        setLoading(false);
        return;
      }

      const userKey = resolveUserKey(user);

      try {
       // 1. Get profile FIRST
        const perfilRes = await fetch(`${API_BASE}/api/perfiles/${userKey}`);

        if (!perfilRes.ok) {
          throw new Error("No se pudo cargar el perfil.");
        }

        const matchedProfile = await perfilRes.json();
        const perfilId = matchedProfile.id;

        // 2. Now fetch the rest using perfilId
        const [comentariosRes, calificacionesRes, filmsRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/comentarios/user/${perfilId}`),
            fetch(`${API_BASE}/api/calificaciones`),
            fetch(`${API_BASE}/api/films`),
          ]);
        if (!filmsRes.ok) {
          throw new Error("No se pudieron cargar las peliculas.");
        }

        const filmsData = await filmsRes.json();
        const filmById = new Map(filmsData.map((film) => [String(film.id), film]));

        if (!comentariosRes.ok || !calificacionesRes.ok) {
          throw new Error("No se pudieron cargar todos los datos del perfil.");
        }

        const comentariosData = await comentariosRes.json();
        const calificacionesData = await calificacionesRes.json();

        const mergedProfile = {
          id: matchedProfile?.id,
          auth_id: matchedProfile?.auth_id,
          tipo: matchedProfile?.tipo,
          nombre: matchedProfile?.nombre || user.user_metadata?.nombre || "Nombre",
          apellidos: matchedProfile?.apellidos || user.user_metadata?.apellidos || "Apellido",
          usuario: user.email?.split("@")[0] || "usuario",
          foto_perfil:
            matchedProfile?.foto_perfil ||
            user.user_metadata?.foto_perfil ||
            DUMMY_PROFILE.foto_perfil,
          cabecera: DUMMY_PROFILE.cabecera,
        };

        const userRatings = calificacionesData.filter(
          (row) => String(row.usuario) === String(perfilId)
        );

        const scoreByMovie = new Map(
          userRatings.map((row) => [String(row.pelicula), Number(row.puntuacion) || 0])
        );

        const rankingData = userRatings
          .map((row) => {
            const movie = filmById.get(String(row.pelicula));
            return {
              pelicula: row.pelicula,
              titulo: movie?.titulo || `Pelicula ${row.pelicula}`,
              img_portada: movie?.img_portada || null,
              puntuacion: Number(row.puntuacion) || 0,
            };
          })
          .sort((a, b) => b.puntuacion - a.puntuacion)
          .slice(0, 10);

        const commentsData = comentariosData.map((comment) => {
          const movie = filmById.get(String(comment.pelicula));
          return {
            id: comment.id,
            pelicula: comment.pelicula,
            titulo: movie?.titulo || `Pelicula ${comment.pelicula}`,
            img_portada: movie?.img_portada || null,
            // Prioriza la valoración (1-5) del propio comentario; si no existe, usa calificación global
            puntuacion: (comment.valoracion > 0)
              ? Number(comment.valoracion)
              : Math.round((scoreByMovie.get(String(comment.pelicula)) ?? 0) / 2),
            comentario: comment.comentariol || "Sin comentario",
          };
        });

        setProfile(mergedProfile);
        setRanking(rankingData);
        setComments(commentsData);
        setUsingDummy(false);
      } catch (err) {
        setError(err.message || "Hubo un problema cargando el perfil.");
        setProfile(DUMMY_PROFILE);
        setRanking(DUMMY_RANKING);
        setComments(DUMMY_COMMENTS);
        setUsingDummy(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const goPrev = () => {
    setCarouselIndex((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    const maxIndex = Math.max(comments.length - 2, 0);
    setCarouselIndex((current) => Math.min(current + 1, maxIndex));
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <p className="home-message perfil-loading">Cargando perfil...</p>
      </div>
    );
  }

  // Guard temporalmente desactivado para permitir acceso sin login.
  // if (!user && !usingDummy) {
  //   return (
  //     <div className="home-wrapper perfil-auth-guard">
  //       <p className="home-message">Necesitas iniciar sesion para ver tu perfil.</p>
  //       <Link to="/login" className="home-btn primary">
  //         Ir a iniciar sesion
  //       </Link>
  //     </div>
  //   );
  // }

  const canGoPrev = carouselIndex > 0;
  const canGoNext = carouselIndex < Math.max(comments.length - 2, 0);

  return (
    <div className="home-wrapper perfil-page">
      
      <Navbar />

      <main className="perfil-main">
        {usingDummy && (
          <p className="perfil-warning">
            No hubo conexion con la base de datos. Estas viendo contenido de ejemplo.
          </p>
        )}
        {error && !usingDummy && <p className="home-error">{error}</p>}

        <section
          className="perfil-header"
          style={{ backgroundImage: `url(${profile?.cabecera || DUMMY_PROFILE.cabecera})` }}
        >
          <div className="perfil-header-overlay" />
          <div className="perfil-header-content">
            <div className="perfil-user-block">
              <img
                className="perfil-avatar"
                src={profile?.foto_perfil || DUMMY_PROFILE.foto_perfil}
                alt="Foto de perfil"
              />
              <div className="perfil-identity">
                <h1>
                  {profile?.nombre} {profile?.apellidos}
                </h1>
                <p>@{profile?.usuario}</p>
              </div>
            </div>

            <button
              className="perfil-edit-btn"
              onClick={() => navigate("/editar-perfil")}
              type="button"
            >
              Editar perfil
            </button>
          </div>
        </section>

        <section className="perfil-block">
          <div className="perfil-block-title-row">
            <h2>Ranking de peliculas favoritas</h2>
          </div>

          <div className="perfil-table-wrap">
            <table className="perfil-ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th aria-label="Cartel"></th>
                  <th>Nombre</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length > 0 ? (
                  ranking.map((item, idx) => (
                    <tr key={`${item.pelicula}-${idx}`}>
                      <td className="ranking-rank">#{idx + 1}</td>
                      <td className="ranking-thumb-cell">
                        <Link to={`/pelicula/${item.pelicula}`} tabIndex={-1}>
                          {item.img_portada ? (
                            <img
                              src={item.img_portada}
                              alt={item.titulo}
                              className="ranking-thumb-img"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="ranking-thumb-initial"
                              style={{ background: titleColor(item.titulo) }}
                            >
                              {item.titulo.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/pelicula/${item.pelicula}`} className="ranking-title-link">
                          {item.titulo}
                        </Link>
                      </td>
                      <td><ScoreRing score={item.puntuacion} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Aun no hay peliculas en tu ranking.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="perfil-block-footer">
            <button
              type="button"
              className="perfil-cta"
              onClick={() => navigate("/calificar-peliculas")}
            >
              Calificar películas
            </button>
          </div>
        </section>

        <section className="perfil-block">
          <div className="perfil-block-title-row">
            <h2>Tus comentarios</h2>
              <div className="perfil-carousel-controls">
                <button onClick={goPrev} disabled={!canGoPrev} type="button">
                  ❮
                </button>

                <button onClick={goNext} disabled={!canGoNext} type="button">
                  ❯
                </button>
              </div>
          </div>

          <div className="perfil-carousel-track">
            {visibleComments.length > 0 ? (
              visibleComments.map((card) => (
                <article className="perfil-comment-card" key={card.id}>
                  <Link
                    to={`/pelicula/${card.pelicula}`}
                    className="perfil-comment-cover"
                    aria-label={`Ver película ${card.titulo}`}
                  >
                    {card.img_portada ? (
                      <img src={card.img_portada} alt={card.titulo} />
                    ) : (
                      <div className="perfil-cover-placeholder">Sin imagen</div>
                    )}
                  </Link>
                  <div className="perfil-comment-content">
                    <Link
                      to={`/pelicula/${card.pelicula}`}
                      className="perfil-comment-title-link"
                    >
                      <h3>{card.titulo}</h3>
                    </Link>
                    <p className="perfil-stars">{toStars(card.puntuacion)}</p>
                    <p>{card.comentario}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="home-message">Aun no has escrito comentarios.</p>
            )}
          </div>
        </section>
      </main>
      <AccessibilityButton />
    </div>
  );
};

export default Perfil;
