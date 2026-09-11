import { useEffect, useState } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Actor.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Actor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/actores/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el actor");
        const data = await res.json();
        setActor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return null;
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const peliculas = actor?.Actor_Film
    ?.map((af) => af.Films ? { ...af.Films, rol: af.rol } : null)
    .filter(Boolean)
    .sort((a, b) => (b.fecha_publicacion || "").localeCompare(a.fecha_publicacion || "")) ?? [];

  if (loading) {
    return (
      <p className="actor-message" role="status" aria-live="polite">
        Cargando actor...
      </p>
    );
  }

  if (error) {
    return (
      <p className="actor-message actor-error" role="alert">
        {error}
      </p>
    );
  }

  if (!actor) return null;

  return (
    <div className="actor-wrapper">

      <Navbar />

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

      <main className="actor-main" id="main-content">

        {/* ── Tarjeta principal ────────────────────────── */}
        <article className="actor-detail">

          {/* Columna izquierda: foto */}
          <aside className="actor-foto-col">
            {actor.foto_perfil ? (
              <img
                src={actor.foto_perfil}
                alt={`Foto de ${actor.nombre}`}
                className="actor-foto"
                width="160"
                height="200"
                loading="lazy"
              />
            ) : (
              <div
                className="actor-foto-placeholder"
                role="img"
                aria-label="Sin foto de perfil"
              >
                Sin imagen
              </div>
            )}
          </aside>

          {/* Columna derecha: info */}
          <div className="actor-info-col">

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h1>{actor.nombre}</h1>
              {actor.fecha_nacimiento && (
                <p className="actor-fecha">
                  {formatearFecha(actor.fecha_nacimiento)}
                </p>
              )}
            </div>

            <dl className="actor-meta-list">
              <dt>Profesión:</dt>
              <dd>Actor / Actriz</dd>
              {actor.nacionalidad && (
                <>
                  <dt>Nacionalidad:</dt>
                  <dd>{actor.nacionalidad}</dd>
                </>
              )}
              {actor.fecha_nacimiento && (
                <>
                  <dt>Fecha de nacimiento:</dt>
                  <dd>{formatearFecha(actor.fecha_nacimiento)}</dd>
                </>
              )}
              {actor.fecha_nacimiento && calcularEdad(actor.fecha_nacimiento) !== null && (
                <>
                  <dt>Edad:</dt>
                  <dd>{calcularEdad(actor.fecha_nacimiento)} años</dd>
                </>
              )}
              {peliculas.length > 0 && (
                <>
                  <dt>Películas:</dt>
                  <dd>{peliculas.length}</dd>
                </>
              )}
            </dl>

            {actor.biografia && (
              <section className="actor-biografia">
                <h2>Biografía</h2>
                <p>{actor.biografia}</p>
              </section>
            )}
          </div>
        </article>

        {/* ── Películas y series ───────────────────────── */}
        {peliculas.length > 0 && (
          <section className="actor-card actor-filmografia">
            <h2>Filmografía</h2>
            <p className="actor-filmografia-sub">
              {peliculas.length} película{peliculas.length !== 1 ? "s" : ""} en la base de datos
            </p>
            <div className="actor-films-grid">
              {peliculas.map((film) => (
                <Link
                  key={film.id}
                  to={`/pelicula/${film.id}`}
                  className="actor-film-item"
                  title={film.titulo}
                >
                  {film.img_portada ? (
                    <img
                      src={film.img_portada}
                      alt={`Portada de ${film.titulo}`}
                      className="actor-film-poster"
                      loading="lazy"
                    />
                  ) : (
                    <div className="actor-film-poster-placeholder">
                      {film.titulo}
                    </div>
                  )}
                  <span className="actor-film-titulo">{film.titulo}</span>
                  {film.fecha_publicacion && (
                    <span className="actor-film-year">
                      {film.fecha_publicacion.slice(0, 4)}
                    </span>
                  )}
                  {film.rol && (
                    <span className="actor-film-rol">como {film.rol}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
      <AccessibilityButton />
    </div>
  );
};

export default Actor;