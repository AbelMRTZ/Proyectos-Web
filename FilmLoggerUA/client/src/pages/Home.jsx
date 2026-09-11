import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryTabs from "../components/CategoryTabs";
import TopSemana from "../components/TopSemana";
import Tendencias from "../components/Tendencias";
import Sorprendeme from "../components/Sorprendeme";
import AccessibilityButton from "../components/boton_accesibilidad";
import "../css/Home.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/films`),
          fetch(`${API_BASE}/api/categorias`),
        ]);
        if (!filmsRes.ok) throw new Error("No se pudieron cargar las películas");
        if (!categoriesRes.ok) throw new Error("No se pudieron cargar las categorías");
        setFilms(await filmsRes.json());
        setCategories(await categoriesRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtra por categoría activa
  const filteredFilms = activeCategory
    ? films.filter((film) => film.categorias?.includes(activeCategory))
    : films;

  // Top semana: las 10 mejor valoradas
  const topFilms = [...filteredFilms]
    .sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0))
    .slice(0, 10);

  // Tendencias: las más recientes con buena calificación
  const tendenciasFilms = [...filteredFilms]
    .sort((a, b) => {
      const dateA = new Date(a.fecha_publicacion ?? 0);
      const dateB = new Date(b.fecha_publicacion ?? 0);
      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <div className="home-wrapper">
      <Navbar />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <main id="main-content">
        {loading && <p className="home-message" role="status">Cargando...</p>}
        {error && <p className="home-error" role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <TopSemana films={topFilms} />
            <Tendencias films={tendenciasFilms} />
            <Sorprendeme
              films={filteredFilms}
              onNavigate={(id) => navigate(`/pelicula/${id}`)}
            />
          </>
        )}
      </main>

      <AccessibilityButton />
    </div>
  );
};

export default Home;