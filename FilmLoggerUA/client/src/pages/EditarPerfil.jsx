import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../img/logo_white.png";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import "../css/EditarPerfil.css";
import AccessibilityButton from "../components/boton_accesibilidad";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EditarPerfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const profileId = id || user?.id;
  const editingFromAdmin = Boolean(id);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    foto_perfil: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (id && id !== user.id) {
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
    }

      if (!profileId) return;

      try {
        const res = await fetch(`${API_BASE}/api/perfiles/${profileId}`);

        if (!res.ok) {
          throw new Error("No se pudo cargar el perfil.");
        }

        const data = await res.json();

        setForm({
          nombre: data.nombre || "",
          apellidos: data.apellidos || "",
          foto_perfil: data.foto_perfil || "",
        });

        setPreviewUrl(data.foto_perfil || "");
      } catch (err) {
        setError(err.message || "Error cargando el perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, profileId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/perfiles/${profileId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo borrar la cuenta.");
      }

      if (editingFromAdmin) {
        navigate("/usuarios");
      } else {
        logout();
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Error borrando la cuenta.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let res;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("apellidos", form.apellidos);
        formData.append("foto_perfil", selectedFile);
        res = await fetch(`${API_BASE}/api/perfiles/${profileId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/api/perfiles/${profileId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nombre, apellidos: form.apellidos }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar el perfil.");
      }

      navigate(editingFromAdmin ? "/usuarios" : "/perfil");
    } catch (err) {
      setError(err.message || "Error guardando el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <p className="home-message">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper editar-perfil-page">
      
      <Navbar />

      <main className="editar-perfil-main">
        <section className="editar-perfil-card">
          <h1>Editar perfil</h1>

          {error && <p className="home-error">{error}</p>}

          <form onSubmit={handleSubmit} className="editar-perfil-form">
            <label>
              Nombre

              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </label>

            <label>
              Apellidos

              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
              />
            </label>

            <label>
              Foto de perfil

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
              />
            </label>

            {previewUrl && (
              <div className="editar-perfil-preview-block">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="editar-perfil-preview"
                />

                <p className="editar-perfil-preview-text">
                  Vista previa de tu foto
                </p>
              </div>
            )}

            <div className="editar-perfil-actions">
              <button
                type="button"
                className="home-btn danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Borrar cuenta
              </button>

              <div className="editar-perfil-actions-right">
                <button
                  type="button"
                  className="home-btn secondary"
                  onClick={() =>
                    navigate(editingFromAdmin ? "/usuarios" : "/perfil")
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="home-btn primary"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>¿Borrar cuenta?</h2>

            <p>Esta acción eliminará tu perfil y no se puede deshacer.</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="home-btn secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="home-btn danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Borrando..." : "Sí, borrar cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AccessibilityButton />
    </div>
  );
};

export default EditarPerfil;