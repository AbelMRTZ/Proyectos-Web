import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import search_icon from "../img/search.png";
import AccessibilityButton from "../components/boton_accesibilidad";
import Navbar from "../components/Navbar";
import "../css/Home.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Mapeo entre código DB y estado React ── */
const THEME_MAP   = { c: "default", o: "dark", ac: "high-contrast" };
const FONT_MAP    = { p: "normal",  g: "large" };
const THEME_TO_DB = { default: "c", dark: "o", "high-contrast": "ac" };
const FONT_TO_DB  = { normal: "p", large: "g" };

function buildDbCode(theme, font) {
  return `${THEME_TO_DB[theme]}-${FONT_TO_DB[font]}`;
}

function applyToDOM(theme, fontSize) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-font",  fontSize);
}

const THEMES = [
  { id: "default",       label: "☀️ Claro" },
  { id: "dark",          label: "🌙 Oscuro" },
  { id: "high-contrast", label: "⬛ Alto contraste" },
];

const FONTS = [
  { id: "normal", label: "A  Normal" },
  { id: "large",  label: "A  Grande" },
];

export default function Accesibilidad() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ← initialized aquí dentro, junto al resto de hooks
  const [initialized, setInitialized] = useState(false);
  const [theme,    setTheme]    = useState("default");
  const [fontSize, setFontSize] = useState("normal");
  const [saving,   setSaving]   = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [search,   setSearch]   = useState("");
  const [tipo,     setTipo]     = useState(null);

  /* ── Leer tipo de usuario ── */
  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) { setTipo(null); return; }
      try {
        const res = await fetch(`${API_BASE}/api/perfiles/${user.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTipo(data.tipo);
      } catch {
        setTipo(null);
      }
    };
    fetchPerfil();
  }, [user]);

  /* ── Al montar: leer DOM y marcar como inicializado ── */
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "default";
    const currentFont  = document.documentElement.getAttribute("data-font")  || "normal";
    setTheme(currentTheme);
    setFontSize(currentFont);
    setInitialized(true);
  }, []);

  /* ── Aplicar al DOM solo tras inicializar (evita el flash a default) ── */
  useEffect(() => {
    if (!initialized) return;
    applyToDOM(theme, fontSize);
    localStorage.setItem("theme",    theme);
    localStorage.setItem("fontSize", fontSize);
  }, [theme, fontSize, initialized]);

  /* ── Guardar en DB ── */
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setFeedback(null);
    const dbCode = buildDbCode(theme, fontSize);
    try {
      const res = await fetch(`${API_BASE}/api/perfiles/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accesibilidad: dbCode }),
      });
      if (!res.ok) throw new Error("Error al guardar preferencias");
      localStorage.setItem("theme",    theme);
      localStorage.setItem("fontSize", fontSize);
      setFeedback({ type: "success", msg: "✅ Preferencias guardadas correctamente" });
    } catch (err) {
      setFeedback({ type: "error", msg: `❌ ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/resultados?q=${search}`);
  };

  return (
    <div className="home-wrapper">

      <Navbar />

      {/* ── Botón volver ── */}
      <div style={styles.backRow}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backBtn}
          aria-label="Volver a la página anterior"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path d="M12 4L6 10l6 6" />
          </svg>
          Volver
        </button>
      </div>

      {/* ── Contenido ── */}
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>Accesibilidad</h1>
        <p style={styles.sub}>
          Personaliza la apariencia de la aplicación.
          {user
            ? " Pulsa «Guardar» para conservar tu configuración en tu cuenta."
            : " Inicia sesión para guardar tu configuración de forma permanente."}
        </p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tema de color</h2>
          <div style={styles.btnGroup}>
            {THEMES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                style={{ ...styles.btn, ...(theme === id ? styles.btnActive : {}) }}
                aria-pressed={theme === id}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tamaño del texto</h2>
          <div style={styles.btnGroup}>
            {FONTS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFontSize(id)}
                style={{
                  ...styles.btn,
                  ...(fontSize === id ? styles.btnActive : {}),
                  fontSize: id === "large" ? "1.15rem" : "0.95rem",
                }}
                aria-pressed={fontSize === id}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Vista previa</h2>
          <div style={styles.preview}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>Título de ejemplo</p>
            <p style={{ fontSize: "0.95em", opacity: 0.75 }}>
              Así se verá el texto normal en la aplicación con la configuración actual.
            </p>
          </div>
        </section>

        {user && (
          <section style={styles.section}>
            {feedback && (
              <p style={{
                ...styles.feedback,
                color: feedback.type === "success"
                  ? "var(--color-success-text)"
                  : "var(--color-error-text)",
              }}>
                {feedback.msg}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.btn, ...styles.btnActive, ...styles.saveBtn }}
            >
              {saving ? "Guardando…" : "Guardar preferencias"}
            </button>
          </section>
        )}
      </div>

      <AccessibilityButton />
    </div>
  );
}

const styles = {
  wrapper: {
    background: "var(--color-bg)",
    color: "var(--color-text)",
    padding: "2.5rem 2rem",
    maxWidth: 640,
    margin: "0 auto",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "var(--color-brand)",
  },
  sub: {
    fontSize: "0.97rem",
    color: "var(--color-text-muted)",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  section:      { marginBottom: "2rem" },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--color-text-muted)",
    marginBottom: "0.75rem",
  },
  btnGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
  btn: {
    padding: "10px 20px",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)",
    background: "var(--color-bg-card)",
    color: "var(--color-text)",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s ease",
  },
  btnActive: {
    background: "var(--color-brand)",
    color: "#ffffff",
    borderColor: "var(--color-brand)",
    fontWeight: 700,
  },
  saveBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "1rem",
    borderRadius: "var(--radius-lg)",
    marginTop: "0.25rem",
  },
  preview: {
    background: "var(--color-bg-card)",
    border: "1.5px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.25rem 1.5rem",
    boxShadow: "var(--shadow-card)",
  },
  feedback: {
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  backRow: {
  maxWidth: 640,
  margin: "1.25rem auto 0",
  padding: "0 2rem",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "none",
    color: "var(--color-text-muted)",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    padding: "0.3rem 0.5rem",
    borderRadius: "var(--radius-sm)",
    transition: "color 0.18s ease, background 0.18s ease",
  },
};