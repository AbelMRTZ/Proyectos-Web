import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import search_icon from "../img/search.png";
import "./Navbar.css";

const Navbar = () => {
  const { user, tipo, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/resultados?q=${search}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar">

      {/* Logo */}
      <div className="navbar-brand">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo FilmLogger" />
          <span>FilmLogger</span>
        </Link>
      </div>

      {/* Links admin — escritorio */}
      {user && tipo === "admin" && (
        <nav className="navbar-links navbar-links--desktop" aria-label="Navegación principal">
          <Link to="/crear-pelicula" className="navbar-link">+ Añadir película</Link>
          <Link to="/usuarios" className="navbar-link">Gestionar Usuarios</Link>
        </nav>
      )}

      {/* Buscador */}
      <search className="navbar-search-wrapper">
        <form onSubmit={handleSearch} role="search">
          <label htmlFor="navbar-search" className="sr-only">
            Buscar película
          </label>
          <input
            id="navbar-search"
            type="search"
            className="navbar-search"
            placeholder="Buscar película"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Buscar">
            <img src={search_icon}/>
          </button>
        </form>
      </search>

      {/* Usuario */}
      <div className="navbar-user">
        {user ? (
          <>
            <Link to="/perfil" className="navbar-user-link" aria-label="Ir a mi perfil">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span className="navbar-username">{user.email.split("@")[0]}</span>
            </Link>
            <button
              className="navbar-logout"
              onClick={logout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <span className="navbar-logout-text">Cerrar sesión</span>
              <svg
                className="navbar-logout-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn secondary">Iniciar sesión</Link>
            <Link to="/register" className="navbar-btn primary">Registrarse</Link>
          </>
        )}

        {/* Hamburguesa — solo admin, solo móvil */}
        {user && tipo === "admin" && (
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú de administración" : "Abrir menú de administración"}
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
          >
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
          </button>
        )}
      </div>

      {/* Menú admin móvil desplegable */}
      {user && tipo === "admin" && (
        <nav
          id="admin-menu"
          className={`navbar-admin-menu ${menuOpen ? "navbar-admin-menu--open" : ""}`}
          aria-label="Menú de administración"
        >
          <Link to="/crear-pelicula" className="navbar-admin-link" onClick={() => setMenuOpen(false)}>
            + Añadir película
          </Link>
          <Link to="/usuarios" className="navbar-admin-link" onClick={() => setMenuOpen(false)}>
            Gestionar Usuarios
          </Link>
        </nav>
      )}

    </header>
  );
};

export default Navbar;