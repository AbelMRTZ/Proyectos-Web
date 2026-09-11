import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /fichajes/activo - Buscar fichaje activo (sin FechaHoraSalida en las últimas 12h)
router.get('/activo', async (req, res) => {
  try {
    const { IdUsuario } = req.query;
    
    const [rows] = await db.query(`
      SELECT f.*, t.Nombre as TrabajoNombre 
      FROM Fichajes f 
      LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo
      WHERE f.IdUsuario = ? 
        AND f.FechaHoraSalida IS NULL 
        AND f.FechaHoraEntrada >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
      ORDER BY f.FechaHoraEntrada DESC 
      LIMIT 1
    `, [IdUsuario]);

    res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar fichaje activo' });
  }
});

// GET /fichajes/hoy - Fichajes del día actual
router.get('/hoy', async (req, res) => {
  try {
    const { IdUsuario } = req.query;
    
    const [rows] = await db.query(`
      SELECT f.*, t.Nombre as TrabajoNombre,
             TIMESTAMPDIFF(HOUR, f.FechaHoraEntrada, f.FechaHoraSalida) as HorasCalculadas
      FROM Fichajes f 
      LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo
      WHERE f.IdUsuario = ? 
        AND DATE(f.FechaHoraEntrada) = CURDATE()
      ORDER BY f.FechaHoraEntrada DESC
    `, [IdUsuario]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener fichajes de hoy' });
  }
});

// POST /fichajes/iniciar - Iniciar nuevo fichaje
router.post('/iniciar', async (req, res) => {
  try {
    const { IdUsuario, IdTrabajo, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO Fichajes 
       (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) 
       VALUES (NOW(), ?, ?, ?, ?)`,
      [IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud]
    );
    
    res.status(201).json({ 
      IdFichaje: result.insertId,
      mensaje: 'Fichaje iniciado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar fichaje' });
  }
});

// PUT /fichajes/finalizar/:id - Finalizar fichaje
router.put('/finalizar/:id', async (req, res) => {
  try {
    const { GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
    const IdFichaje = req.params.id;
    
    // Calcular horas trabajadas automáticamente
    const [result] = await db.query(
      `UPDATE Fichajes 
       SET FechaHoraSalida = NOW(),
           GeolocalizacionLatitud = ?,
           GeolocalizacionLongitud = ?,
           HorasTrabajadas = TIMESTAMPDIFF(HOUR, FechaHoraEntrada, NOW())
       WHERE IdFichaje = ?`,
      [GeolocalizacionLatitud, GeolocalizacionLongitud, IdFichaje]
    );
    
    res.json({ 
      mensaje: 'Fichaje finalizado correctamente',
      horasTrabajadas: result.affectedRows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al finalizar fichaje' });
  }
});

export default router;

// router.get('/', (req, res) => res.json([{ id: 1, fecha: '2025-10-16' }]));