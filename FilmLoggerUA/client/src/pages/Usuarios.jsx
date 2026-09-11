import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/Usuarios.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Usuarios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkAdminAndLoad = async () => {
      try {
        const perfilRes = await fetch(`${API_BASE}/api/perfiles/${user.id}`);

        if (!perfilRes.ok) {
          navigate("/");
          return;
        }

        const perfilData = await perfilRes.json();

        const isAdmin =
          String(perfilData.tipo).trim().toLowerCase() === "admin";

        if (!isAdmin) {
          navigate("/");
          return;
        }

        const usuariosRes = await fetch(`${API_BASE}/api/perfiles`);

        if (!usuariosRes.ok) {
          throw new Error("No se pudieron cargar los usuarios.");
        }

        const usuariosData = await usuariosRes.json();

        const filteredUsers = usuariosData.filter(
          (usuario) => usuario.auth_id !== user.id
        );

        setUsuarios(filteredUsers);
      } catch (err) {
        setError(err.message || "Error cargando usuarios.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoad();
  }, [user, navigate]);

  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE}/api/perfiles/${selectedUser.auth_id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo borrar.");
      }

      setUsuarios((current) =>
        current.filter((usuario) => usuario.auth_id !== selectedUser.auth_id)
      );

      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "Error borrando usuario.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <p className="home-message">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper usuarios-page">
      <AccessibilityButton />
      <Navbar />
      <div className="crear-topbar">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Volver</span>
        </button>
      </div>
      <main className="usuarios-main">
        <section className="usuarios-card">
          <h1>Usuarios</h1>

          {error && <p className="home-error">{error}</p>}

          <div className="usuarios-list">
            {usuarios.map((usuario) => (
              <div key={usuario.auth_id} className="usuario-row">
                <div className="usuario-info">
                  <h3>@{usuario.usuario}</h3>
                  <p>{usuario.email}</p>
                </div>

                <div className="usuario-actions">
                  <button
                    type="button"
                    className="home-btn secondary"
                    onClick={() => navigate(`/editar-perfil/${usuario.auth_id}`)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="home-btn danger"
                    onClick={() => setSelectedUser(usuario)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {selectedUser && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>¿Borrar usuario?</h2>

            <p>Esta acción eliminará la cuenta de:</p>

            <strong>@{selectedUser.usuario}</strong>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="home-btn secondary"
                onClick={() => setSelectedUser(null)}
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="home-btn danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Borrando..." : "Sí, borrar"}
              </button>
            </div>
          </div>
        </div>
      )}
      <AccessibilityButton />
    </div>
  );
};

export default Usuarios;