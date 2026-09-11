import { useState } from "react";
import "./CreateMovieForm.css";

const API_URL = "http://localhost:3000/api/films";

export default function CreateMovieForm() {
  const [form, setForm] = useState({
    titulo: "",
    sinopsis: "",
    fecha_publicacion: "",
    director: "",
    estado: "activo",
  });

  const [portada, setPortada]       = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [status, setStatus]         = useState(null); // { type: "success"|"error", message }
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    // Build FormData — required for file uploads
    const formData = new FormData();

    // Append text fields
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Append single portada
    if (portada) {
      formData.append("portada", portada);
      console.log("[Form] portada:", portada.name, portada.type);
    }

    // Append multiple media files
    Array.from(mediaFiles).forEach((file) => {
      formData.append("files", file);
      console.log("[Form] media file:", file.name, file.type);
    });

    try {
      console.log("[Fetch] POST", API_URL);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
        // ⚠️ Do NOT set Content-Type manually — browser sets it with boundary
      });

      const json = await res.json();
      console.log("[Response]", res.status, json);

      if (!res.ok) {
        throw new Error(json.error || "Unknown error");
      }

      setStatus({
        type: "success",
        message: `✅ Movie "${json.movie.titulo}" created! ID: ${json.movie.id}`,
      });

      // Reset form
      setForm({ titulo: "", sinopsis: "", fecha_publicacion: "", director: "", estado: "activo" });
      setPortada(null);
      setMediaFiles([]);
      e.target.reset();

    } catch (err) {
      console.error("[Error]", err.message);
      setStatus({ type: "error", message: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h1 className="form-title">🎬 Add New Movie</h1>

      <form className="movie-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="e.g. Inception"
            required
          />
        </div>

        <div className="form-group">
          <label>Synopsis *</label>
          <textarea
            name="sinopsis"
            value={form.sinopsis}
            onChange={handleChange}
            placeholder="Brief description of the movie..."
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Release Date *</label>
            <input
              type="date"
              name="fecha_publicacion"
              value={form.fecha_publicacion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Director</label>
            <input
              type="text"
              name="director"
              value={form.director}
              onChange={handleChange}
              placeholder="e.g. Christopher Nolan"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="activo">Active</option>
            <option value="inactivo">Inactive</option>
          </select>
        </div>

        {/* ── File Inputs ── */}
        <div className="file-section">
          <div className="form-group">
            <label>Cover Image (portada)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setPortada(e.target.files[0] ?? null)}
            />
            {portada && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(portada)}
                  alt="portada preview"
                  className="portada-preview"
                />
                <span className="file-name">{portada.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Multimedia Files (images / videos)</label>
            <input
              type="file"
              accept="image/*,video/mp4,video/quicktime,video/x-msvideo"
              multiple
              onChange={(e) => setMediaFiles(e.target.files)}
            />
            {mediaFiles.length > 0 && (
              <ul className="file-list">
                {Array.from(mediaFiles).map((f, i) => (
                  <li key={i}>
                    <span className="file-badge">{f.type.split("/")[0]}</span>
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading…" : "Create Movie"}
        </button>

      </form>
    </div>
  );
}