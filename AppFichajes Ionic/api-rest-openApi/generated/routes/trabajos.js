import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /trabajos - Obtener todos los trabajos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Trabajos ORDER BY Nombre');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
});

// GET /trabajos/:id - Obtener trabajo específico
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Trabajos WHERE IdTrabajo = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener trabajo' });
  }
});

export default router;

// router.get('/', (req, res) => res.json([{ id: 1, titulo: 'Backend dev' }]));

