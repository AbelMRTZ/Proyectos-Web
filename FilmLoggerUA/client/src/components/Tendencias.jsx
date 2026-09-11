import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Tendencias.css";

const StarRating = ({ value }) => {
  const total = 5;
  const filled = Math.round(value || 0);
  return (
    <div className="stars" aria-label={`${filled} de 5 estrellas`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < filled ? "star filled" : "star"} aria-hidden="true">
          {i < filled ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

const FilmCard = ({ film }) => (
  <article className="tendencia-card">
    <Link to={`/pelicula/${film.id}`} className="tendencia-card-inner">
      {film.img_portada ? (
        <img
          src={film.img_portada}
          alt={`Portada de ${film.titulo}`}
          className="tendencia-poster"
          loading="lazy"
        />
      ) : (
        <div className="tendencia-poster-placeholder">Sin imagen</div>
      )}
      <div className="tendencia-info">
        <h3>
          <strong>{film.titulo}</strong>
          {film.fecha_publicacion && (
            <span className="tendencia-year">
              {" "}({new Date(film.fecha_publicacion).getFullYear()})
            </span>
          )}
        </h3>
        <p className="tendencia-meta">
          {film.categorias_nombres?.length > 0 && (
            <span>{film.categorias_nombres[0]}</span>
          )}
          {film.duracion && <span> · {film.duracion} min</span>}
        </p>
        <p className="tendencia-sinopsis">{film.sinopsis?.substring(0, 100)}...</p>
        <StarRating value={film.calificacion} />
        <span className="tendencia-btn">Ver ficha →</span>
      </div>
    </Link>
  </article>
);

const Tendencias = ({ films }) => {
  const [tab, setTab] = useState("peliculas");
  if (!films.length) return null;

  const mostradas = [...films].sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0)).slice(0, 2);

  return (
    <section className="tendencias" aria-label="Tendencias">
      <div className="tendencias-header">
        <h2>Tendencias</h2>
        <p>Las más buscadas</p>
      </div>

      <div className="tendencias-grid" role="tabpanel">
        {mostradas.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </section>
  );
};

export default Tendencias;