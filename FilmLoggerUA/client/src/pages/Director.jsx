import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import "../css/Actor.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Director = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/directores/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el director");
        const data = await res.json();
        setDirector(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorData();
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

  const peliculas = director?.Films
    ?.filter(Boolean)
    .sort((a, b) => (b.fecha_publicacion || "").localeCompare(a.fecha_publicacion || "")) ?? [];

  if (loading) {
    return (
      <p className="actor-message" role="status" aria-live="polite">
        Cargando director...
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

  if (!director) return null;

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
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Volver</span>
        </button>
      </div>

      <main className="actor-main" id="main-content">

        {/* ── Tarjeta principal ── */}
        <article className="actor-detail">

          {/* Foto */}
          <aside className="actor-foto-col">
            {director.foto_perfil ? (
              <img
                src={director.foto_perfil}
                alt={`Foto de ${director.nombre}`}
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

          {/* Info: todo en columna, sin fila nombre/fecha */}
          <div className="actor-info-col">

            <h1>{director.nombre}</h1>

            <dl className="actor-meta-list">
              <dt>Profesión:</dt>
              <dd>Director / Directora</dd>

              {director.nacionalidad && (
                <>
                  <dt>Nacionalidad:</dt>
                  <dd>{director.nacionalidad}</dd>
                </>
              )}

              {director.fecha_nacimiento && (
                <>
                  <dt>Nacimiento:</dt>
                  <dd>{formatearFecha(director.fecha_nacimiento)}</dd>
                </>
              )}

              {director.fecha_nacimiento && calcularEdad(director.fecha_nacimiento) !== null && (
                <>
                  <dt>Edad:</dt>
                  <dd>{calcularEdad(director.fecha_nacimiento)} años</dd>
                </>
              )}

              {peliculas.length > 0 && (
                <>
                  <dt>Películas:</dt>
                  <dd>{peliculas.length}</dd>
                </>
              )}
            </dl>

            {director.biografia && (
              <section className="actor-biografia">
                <h2>Biografía</h2>
                <p>{director.biografia}</p>
              </section>
            )}

          </div>
        </article>

        {/* ── Filmografía ── */}
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
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default Director;