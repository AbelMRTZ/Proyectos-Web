import express from 'express';
import path from 'path';
import cors from 'cors';
import pool from './db.js';

const app = express();
// Resolve directory of this module (login folder)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(cors());
app.use(express.json());

// Endpoint de login: verifica Usuario, Clave y devuelve permisos
app.post('/auth/login', async (req, res) => {
  const { usuario, clave } = req.body || {};
  if (!usuario || !clave) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [rows] = await pool.query(
      'SELECT IdUsuario, Nombre, Usuario, permisos FROM Usuarios WHERE Usuario = ? AND Clave = ?',
      [usuario, clave]
    );

    if (!rows || rows.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

    // devolver solo lo necesario
    const u = rows[0];
    res.json({ usuario: { IdUsuario: u.IdUsuario, Nombre: u.Nombre, Usuario: u.Usuario, permisos: u.permisos } });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// Servir archivos estáticos desde la carpeta `login`
app.use(express.static(__dirname));

// Página principal: sirve login.html en /
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Login server listening on http://localhost:${PORT}`));
