import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/Resultados.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Peliculas = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/films`);

        if (!res.ok) {
          throw new Error("No se pudieron cargar las películas");
        }

        const data = await res.json();
        setFilms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  return (
    <div className="home-wrapper">
      <Navbar />

      <main className="results-main">
        <div className="results-container">
          <h1 className="results-title">Películas</h1>

          <p className="results-subtitle">
            Explora todas las películas disponibles
          </p>

          <section className="results-area">
            {loading && (
              <p className="home-message">
                Cargando películas...
              </p>
            )}

            {error && (
              <p className="home-error">
                {error}
              </p>
            )}

            {!loading && !error && films.length === 0 && (
              <p className="home-message">
                No hay películas disponibles.
              </p>
            )}

            {!loading && !error && films.length > 0 && (
              <div className="films-grid">
                {films.map((film) => (
                  <Link
                    to={`/pelicula/${film.id}`}
                    className="film-card-link"
                    key={film.id}
                  >
                    <article className="film-card">
                      <div className="film-poster-wrapper">
                        {film.img_portada ? (
                          <img
                            src={film.img_portada}
                            alt={film.titulo}
                            className="film-poster"
                          />
                        ) : (
                          <div className="film-poster-placeholder">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div className="film-card-body">
                        <h3>{film.titulo}</h3>

                        <p className="film-meta">
                          <strong>Director:</strong>{" "}
                          {film.director || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Fecha:</strong>{" "}
                          {film.fecha_publicacion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Duración:</strong>{" "}
                          {film.duracion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>País:</strong>{" "}
                          {film.pais_produccion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Estado:</strong>{" "}
                          {film.estado || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Calificación:</strong>{" "}
                          {film.calificacion || "No disponible"}
                        </p>

                        <p className="film-desc">
                          {film.sinopsis}
                        </p>

                        {film.trailer && (
                        <button
                            type="button"
                            className="film-trailer-link"
                            onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(film.trailer, "_blank", "noopener,noreferrer");
                            }}
                        >
                            Ver tráiler
                        </button>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <AccessibilityButton />
    </div>
  );
};

export default Peliculas;