import { Link } from "react-router-dom";
import "../css/TopSemana.css";

const TopSemana = ({ films }) => {
  if (!films.length) return null;

  const topFilms = [...films]
    .sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
    .slice(0, 10);

  return (
    <section className="top-semana" aria-label="Top de la semana">
      <div className="top-semana-header">
        <h2>Top de la semana</h2>
        <p>Las mejor valoradas por la comunidad</p>
      </div>

      <div className="top-semana-carousel" role="list">
        {topFilms.map((film) => (
          <Link
            to={`/pelicula/${film.id}`}
            key={film.id}
            className="top-semana-item"
            role="listitem"
            aria-label={`Ver ficha de ${film.titulo}`}
          >
            {film.img_portada ? (
              <img
                src={film.img_portada}
                alt={`Portada de ${film.titulo}`}
                className="top-semana-poster"
                loading="lazy"
              />
            ) : (
              <div className="top-semana-placeholder" aria-hidden="true">
                {film.titulo}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="top-semana-footer">
        <Link to="/peliculas" className="top-semana-ver-todas">
          Ver todas las películas →
        </Link>
      </div>
    </section>
  );
};

export default TopSemana;