import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT IdUsuario, Nombre, Usuario FROM Usuarios');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /usuarios/:id - Obtener usuario específico
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT IdUsuario, Nombre, Usuario FROM Usuarios WHERE IdUsuario = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /usuarios/login - Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { Usuario, Clave } = req.body;
    
    const [rows] = await db.query(
      'SELECT IdUsuario, Nombre, Usuario FROM Usuarios WHERE Usuario = ? AND Clave = ?',
      [Usuario, Clave]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    res.json({
      mensaje: 'Login exitoso',
      usuario: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

export default router;

// router.get('/', (req, res) => res.json([{ id: 1, nombre: 'Abel' }]));
// router.post('/', (req, res) => res.status(201).json(req.body));

