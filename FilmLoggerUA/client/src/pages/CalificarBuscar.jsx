import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import search_icon from "../img/search.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/Resultados.css";
import "../css/CalificarBuscar.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CalificarBuscar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/films`);
        if (!res.ok) throw new Error("No se pudieron cargar las películas.");
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

  const filtered = films.filter(
    (f) =>
      query === "" ||
      f.titulo?.toLowerCase().includes(query.toLowerCase()) ||
      f.director?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="home-wrapper">
      
      <Navbar />

      <main className="results-main">
        <div className="results-container">
          <button className="back-btn" onClick={() => navigate("/perfil")}>
            ← Volver al perfil
          </button>

          <h1 className="results-title">Calificar película</h1>
          <p className="results-subtitle">
            Busca una película y pulsa <strong>+</strong> para añadir tu puntuación
          </p>

          <form className="results-search-form" onSubmit={(e) => e.preventDefault()}>
            <label className="results-label">¿Qué película quieres calificar?</label>
            <div className="results-search-bar">
              <input
                type="text"
                placeholder="Ej: Interstellar, Parasite, Kubrick..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <img src={search_icon} alt="Buscar" />
              </button>
            </div>
          </form>

          <section className="results-area">
            {loading && <p className="home-message">Cargando películas...</p>}
            {error && <p className="home-error">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <p className="home-message">No se encontraron películas.</p>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="calificar-grid">
                {filtered.map((film) => (
                  <article key={film.id} className="calificar-card">
                    <div className="calificar-poster">
                      {film.img_portada ? (
                        <img src={film.img_portada} alt={film.titulo} />
                      ) : (
                        <div className="calificar-poster-placeholder">Sin imagen</div>
                      )}
                    </div>

                    <div className="calificar-info">
                      <h3>{film.titulo}</h3>
                      {film.director && (
                        <p className="calificar-meta">{film.director}</p>
                      )}
                      {film.fecha_publicacion && (
                        <p className="calificar-meta">
                          {film.fecha_publicacion.slice(0, 4)}
                        </p>
                      )}
                    </div>

                    <button
                      className="calificar-add-btn"
                      type="button"
                      onClick={() => navigate(`/calificar/${film.id}`)}
                      aria-label={`Calificar ${film.titulo}`}
                    >
                      +
                    </button>
                  </article>
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

export default CalificarBuscar;
