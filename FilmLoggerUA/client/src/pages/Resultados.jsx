import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import search_icon from "../img/search.png";
import "../css/Resultados.css";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Resultados = () => {
  const { user, logout } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [navSearch, setNavSearch] = useState("");
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/films`),
          fetch(`${API_BASE}/api/categorias`)
        ]);

        if (!filmsRes.ok) {
          throw new Error("No se pudieron cargar los resultados");
        }

        if (!categoriesRes.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }

        const filmsData = await filmsRes.json();
        const categoriesData = await categoriesRes.json();

        setFilms(filmsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  const handleResultsSearch = (e) => {
    e.preventDefault();

    navigate(`/resultados?q=${encodeURIComponent(search)}`, {
      state: {
        from: location.state?.from || "/"
      }
    });
  };

  const handleNavSearch = (e) => {
    e.preventDefault();

    navigate(`/resultados?q=${encodeURIComponent(navSearch)}`, {
      state: {
        from: location.state?.from || location.pathname
      }
    });

    setNavSearch("");
  };

  const filteredFilms = films.filter((film) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      film.titulo?.toLowerCase().includes(query) ||
      film.director?.toLowerCase().includes(query) ||
      film.sinopsis?.toLowerCase().includes(query);

    const matchesCategory =
      !activeCategory || film.categorias?.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-wrapper">
      
      <Navbar />

      <main className="results-main">
        <div className="results-container">
          <button
            className="back-btn"
            onClick={() => {
              navigate(location.state?.from || "/");
            }}
          >
            ← Volver
          </button>

          <h1 className="results-title">Buscar</h1>

          <p className="results-subtitle">
            Escribe un título, actor o director, o usa los filtros
          </p>

          <form className="results-search-form" onSubmit={handleResultsSearch}>
            <label className="results-label">¿Qué quieres ver?</label>

            <div className="results-search-bar">
              <input
                type="text"
                placeholder="Ej: Severance, Green Book, Timothée Chalamet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="button"
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                ☰
              </button>

              <button type="submit" className="search-btn">
                <img src={search_icon} alt="Buscar" />
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="categories-block">
              <h3>Categorías</h3>

              <div className="categories-list">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-chip ${activeCategory === cat.id ? "active" : ""}`}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat.id ? null : cat.id)
                    }
                  >
                    {cat.categoria}
                  </button>
                ))}
              </div>
            </div>
          )}

          <section className="results-area">
            {loading && <p className="home-message">Cargando resultados...</p>}
            {error && <p className="home-error">{error}</p>}

            {!loading && !error && filteredFilms.length === 0 && (
              <p className="home-message">No se encontraron resultados.</p>
            )}

            {!loading && !error && filteredFilms.length > 0 && (
              <div className="films-grid">
                {filteredFilms.map((film) => (
                  <Link to={`/pelicula/${film.id}`} className="film-card-link" key={film.id}>
                    <article className="film-card">
                      <div className="film-poster-wrapper">
                        {film.img_portada ? (
                          <img
                            src={film.img_portada}
                            alt={film.titulo}
                            className="film-poster"
                          />
                        ) : (
                          <div className="film-poster-placeholder">Sin imagen</div>
                        )}
                      </div>

                      <div className="film-card-body">
                        <h3>{film.titulo}</h3>

                        <p className="film-meta">
                          <strong>Director:</strong> {film.director || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Fecha:</strong> {film.fecha_publicacion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Duración:</strong> {film.duracion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>País:</strong> {film.pais_produccion || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Estado:</strong> {film.estado || "No disponible"}
                        </p>

                        <p className="film-meta">
                          <strong>Calificación:</strong> {film.calificacion || "No disponible"}
                        </p>

                        <p className="film-desc">{film.sinopsis}</p>

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

export default Resultados;