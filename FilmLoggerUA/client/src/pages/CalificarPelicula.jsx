import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/CalificarPelicula.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CalificarPelicula = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);
  const [perfilId, setPerfilId] = useState(null);
  const [score, setScore] = useState(5);
  const [existingRating, setExistingRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [filmRes, perfilRes] = await Promise.all([
          fetch(`${API_BASE}/api/films/${id}`),
          fetch(`${API_BASE}/api/perfiles/${user.id}`),
        ]);

        if (!filmRes.ok) throw new Error("No se encontró la película.");
        if (!perfilRes.ok) throw new Error("No se pudo cargar tu perfil.");

        const filmData = await filmRes.json();
        const perfilData = await perfilRes.json();

        setFilm(filmData);
        setPerfilId(perfilData.id);

        // Comprobar si el usuario ya calificó esta película
        const ratingRes = await fetch(
          `${API_BASE}/api/calificaciones/${id}/${perfilData.id}`
        );
        if (ratingRes.ok) {
          const ratingData = await ratingRes.json();
          if (ratingData) {               // ← guard against null response
            setExistingRating(ratingData);
            setScore(ratingData.puntuacion ?? 5);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user, navigate]);

  const handleSave = async () => {
    if (!perfilId) return;
    setSaving(true);
    setError("");
    try {
      const url = existingRating
        ? `${API_BASE}/api/calificaciones/${id}/${perfilId}`
        : `${API_BASE}/api/calificaciones`;
      const method = existingRating ? "PUT" : "POST";
      const body = existingRating
        ? JSON.stringify({ puntuacion: score })
        : JSON.stringify({ pelicula: Number(id), usuario: perfilId, puntuacion: score });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar la calificación.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/perfil"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <p className="home-message" style={{ padding: "40px 20px" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      
      <Navbar />

      <main className="calificarpeli-main">
        <div className="calificarpeli-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          {film && (
            <div className="calificarpeli-preview">
              {film.img_portada && (
                <img
                  className="calificarpeli-poster"
                  src={film.img_portada}
                  alt={film.titulo}
                />
              )}
              <div className="calificarpeli-film-info">
                <h1>{film.titulo}</h1>
                {film.director && (
                  <p className="calificarpeli-director">{film.director}</p>
                )}
                {film.fecha_publicacion && (
                  <p className="calificarpeli-year">
                    {film.fecha_publicacion.slice(0, 4)}
                  </p>
                )}
                {film.sinopsis && (
                  <p className="calificarpeli-sinopsis">{film.sinopsis}</p>
                )}
              </div>
            </div>
          )}

          <div className="calificarpeli-score-block">
            <p className="calificarpeli-score-label">
              Tu puntuación: <strong>{score}</strong> / 10
            </p>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="calificarpeli-slider"
            />
            <div className="calificarpeli-score-display">
              <span className="calificarpeli-score-number">{score}</span>
            </div>
          </div>

          {error && <p className="home-error calificarpeli-error">{error}</p>}

          {success && (
            <p className="calificarpeli-success">
              ¡Guardado! Volviendo al perfil...
            </p>
          )}

          <button
            className="calificarpeli-save-btn"
            onClick={handleSave}
            disabled={saving || success}
            type="button"
          >
            {saving
              ? "Guardando..."
              : existingRating
              ? "Actualizar puntuación"
              : "Guardar puntuación"}
          </button>
        </div>
      <AccessibilityButton />
      </main>
    </div>
  );
};

export default CalificarPelicula;
