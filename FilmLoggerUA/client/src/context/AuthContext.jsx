import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const THEME_MAP = { c: "default", o: "dark", ac: "high-contrast" };
const FONT_MAP  = { p: "normal", g: "large" };

function parseDbCode(code) {
  if (!code) return { theme: "default", fontSize: "normal" };
  const [themeCode, fontCode] = code.split("-");
  return {
    theme:    THEME_MAP[themeCode]  ?? "default",
    fontSize: FONT_MAP[fontCode]    ?? "normal",
  };
}

function applyToDOM(theme, fontSize) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-font",  fontSize);
}

// Nueva función: llama a tu endpoint y aplica el resultado
async function loadAndApplyPerfil(authId) {
  try {
    const res = await fetch(`${API_BASE}/api/perfiles/${authId}`);
    if (!res.ok) return;
    const perfil = await res.json();
    const { theme, fontSize } = parseDbCode(perfil.accesibilidad);

    // ← Sincroniza localStorage para que index.html lo lea correctamente
    localStorage.setItem("theme",    theme);
    localStorage.setItem("fontSize", fontSize);

    applyToDOM(theme, fontSize);
    return perfil.tipo ?? null;
  } catch (err) {
    console.error("Error cargando perfil de accesibilidad:", err);
    return null;
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo]       = useState(null); // ← Nuevo estado para el tipo de usuario

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      // ← Si ya hay sesión activa (recarga de página), carga el perfil
      if (currentUser) loadAndApplyPerfil(currentUser.id).then(setTipo);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        loadAndApplyPerfil(currentUser.id).then(setTipo);
      } else {
        // ← Logout: borrar localStorage y volver a defaults
        setTipo(null);
        localStorage.removeItem("theme");
        localStorage.removeItem("fontSize");
        applyToDOM("default", "normal");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email, password, nombre, apellidos, foto_perfil = "") => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre, apellidos, foto_perfil } }
    });
    if (error) throw error;
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
    // No hace falta llamar loadAndApplyPerfil aquí:
    // onAuthStateChange lo detecta automáticamente
  };

 const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // onAuthStateChange se encarga del resto automáticamente
};

  return (
    <AuthContext.Provider value={{ user, tipo, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);