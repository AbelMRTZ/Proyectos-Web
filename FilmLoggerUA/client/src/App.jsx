import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import CrearPelicula from "./pages/CrearPelicula"; // ← añadir
import Pelicula from "./pages/Pelicula";
import Perfil from "./pages/Perfil";
import Accesibilidad from "./pages/Accesibilidad";
import EditarPerfil from "./pages/EditarPerfil";
import Usuarios from "./pages/Usuarios";
import Actor from "./pages/Actor";
import CalificarBuscar from "./pages/CalificarBuscar";
import CalificarPelicula from "./pages/CalificarPelicula";
import Peliculas from "./pages/Peliculas"
import EditarPelicula from "./pages/EditarPelicula";
import Director from "./pages/Director";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/Accesibilidad" element={<Accesibilidad />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/pelicula/:id" element={<Pelicula />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/crear-pelicula" element={<CrearPelicula />} /> {/* ← añadir */}
          <Route path="/peliculas/editar/:id" element={<EditarPelicula />} />
          <Route path="/perfil" element={<ProtectedRoute> <Perfil /> </ProtectedRoute>} />
          <Route path="/editar-perfil" element={<ProtectedRoute> <EditarPerfil /> </ProtectedRoute>} />
          <Route path="/editar-perfil/:id" element={<ProtectedRoute> <EditarPerfil /> </ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute> <Usuarios /> </ProtectedRoute>} />
          <Route path="/actores/:id" element={<Actor />} />
          <Route path="/directores/:id" element={<Director />} />
          <Route path="/calificar-peliculas" element={<ProtectedRoute> <CalificarBuscar /> </ProtectedRoute>} />
          <Route path="/calificar/:id" element={<ProtectedRoute> <CalificarPelicula /> </ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;