import db from '../db.js';
// const db = require('../db');

/* eslint-disable no-unused-vars */
// const Service = require('./Service');
import Service from './Service.js';

/**
* Listar fichajes
*
* idUsuario Integer  (optional)
* desde date  (optional)
* hasta date  (optional)
* returns List
* */
const fichajesGET = ({ idUsuario, desde, hasta }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Fichajes');
      resolve(Service.successResponse(rows));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Eliminar fichaje
*
* id Integer 
* no response value expected for this operation
* */
const fichajesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [result] = await db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [id]);
      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Fichaje no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Fichaje eliminado correctamente' }));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener fichaje por id
*
* id Integer 
* returns Fichaje
* */
const fichajesIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id]);
      if (rows.length === 0)
        return reject(Service.rejectResponse('Fichaje no encontrado', 404));

      resolve(Service.successResponse(rows[0]));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar fichaje (cerrar con fecha salida)
*
* id Integer 
* fichajeUpdate FichajeUpdate 
* no response value expected for this operation
* */
const fichajesIdPUT = ({ id, fichajeUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { fechaHoraEntrada, fechaHoraSalida, horasTrabajadas, idTrabajo, idUsuario, geolocalizacionLatitud, geolocalizacionLongitud } = fichajeUpdate;
      const [result] = await db.query(
        'UPDATE Fichajes SET FechaHoraEntrada = ?, FechaHoraSalida = ?, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud = ? WHERE IdFichaje = ?',
        [fechaHoraEntrada, fechaHoraSalida, horasTrabajadas, idTrabajo, idUsuario, geolocalizacionLatitud, geolocalizacionLongitud, id]
      );

      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Fichaje no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Fichaje actualizado correctamente' }));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Crear fichaje (entrada)
*
* fichajeCreate FichajeCreate 
* no response value expected for this operation
* */
const fichajesPOST = ({ fichajeCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { fechaHoraEntrada, fechaHoraSalida, horasTrabajadas, idTrabajo, idUsuario, geolocalizacionLatitud, geolocalizacionLongitud } = fichajeCreate;
      
      // Validar usuario existente
      const [user] = await db.query('SELECT id FROM Usuarios WHERE id = ?', [idUsuario]);
      if (user.length === 0)
        return reject(Service.rejectResponse('Usuario no existente', 400));

      // Validar trabajo existente
      const [work] = await db.query('SELECT id FROM Trabajos WHERE id = ?', [idTrabajo]);
      if (work.length === 0)
        return reject(Service.rejectResponse('Trabajo no existente', 400));
      
      const [result] = await db.query(
        'INSERT INTO Fichajes (FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [fechaHoraEntrada, fechaHoraSalida, horasTrabajadas, idTrabajo, idUsuario, geolocalizacionLatitud, geolocalizacionLongitud],
      );
      resolve(Service.successResponse({
        id: result.insertId,
        mensaje: 'Fichaje creado correctamente'
      }));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener todos los trabajos
*
* returns List
* */
const trabajosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Trabajos');
      resolve(Service.successResponse(rows));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Eliminar trabajo
*
* id Integer 
* no response value expected for this operation
* */
const trabajosIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [result] = await db.query('DELETE FROM Trabajos WHERE IdTrabajo = ?', [id]);
      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Trabajo no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Trabajo eliminado correctamente' }));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener trabajo por id
*
* id Integer 
* returns Trabajo
* */
const trabajosIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Trabajos WHERE IdTrabajo = ?', [id]);
      if (rows.length === 0)
        return reject(Service.rejectResponse('Trabajo no encontrado', 404));

      resolve(Service.successResponse(rows[0]));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar trabajo
*
* id Integer 
* trabajoCreate TrabajoCreate 
* no response value expected for this operation
* */
const trabajosIdPUT = ({ id, trabajoUpdate, trabajoCreate, body, nombre }) => new Promise(
  async (resolve, reject) => {
    try {
      // Soportar múltiples formas de cuerpo, similar a usuariosIdPUT
      const payload = trabajoUpdate || trabajoCreate || body || {};
      const finalNombre = nombre || payload?.nombre || payload?.Nombre;

      if (!finalNombre || typeof finalNombre !== 'string') {
        return reject(Service.rejectResponse('Campo nombre obligatorio', 400));
      }

      const [result] = await db.query(
        'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?',
        [finalNombre, id]
      );

      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Trabajo no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Trabajo actualizado correctamente', id }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Crear trabajo
*
* trabajoCreate TrabajoCreate 
* no response value expected for this operation
* */
const trabajosPOST = ({ trabajoCreate, trabajoUpdate, body, nombre }) => new Promise(
  async (resolve, reject) => {
    try {
      // Logging ampliado
      console.log('[trabajosPOST] Incoming params:', { trabajoCreate, trabajoUpdate, body, nombre });
      console.log('[trabajosPOST] Raw request body snapshot:', JSON.stringify(trabajoCreate || trabajoUpdate || body || {}, null, 2));

      const payload = trabajoCreate || trabajoUpdate || body || {};
      const finalNombreRaw = nombre || payload?.nombre || payload?.Nombre || '';
      const finalNombre = typeof finalNombreRaw === 'string' ? finalNombreRaw.trim() : '';

      if (!finalNombre) {
        console.log('[trabajosPOST] Validation failed. finalNombreRaw:', finalNombreRaw);
        return reject(Service.rejectResponse('Campo Nombre obligatorio (no vacío)', 400));
      }

      const [result] = await db.query(
        'INSERT INTO Trabajos (Nombre) VALUES (?)',
        [finalNombre],
      );
      console.log('[trabajosPOST] Insert OK id:', result.insertId, 'Nombre:', finalNombre);
      resolve(Service.successResponse({
        id: result.insertId,
        Nombre: finalNombre,
        mensaje: 'Trabajo creado correctamente'
      }, 201));
    } catch (e) {
      console.error('[trabajosPOST] Error:', e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 400,
      ));
    }
  },
);
/**
* Obtener todos los usuarios
*
* returns List
* */
const usuariosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Usuarios');
      resolve(Service.successResponse(rows));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Eliminar usuario
*
* id Integer 
* no response value expected for this operation
* */
const usuariosIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [result] = await db.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [id]);
      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Usuario no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Usuario eliminado correctamente' }));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener usuario por id
*
* id Integer 
* returns Usuario
* */
const usuariosIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const [rows] = await db.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id]);
      if (rows.length === 0)
        return reject(Service.rejectResponse('Usuario no encontrado', 404));

      resolve(Service.successResponse(rows[0]));
      // Fin añadido mio
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar usuario
*
* id Integer 
* usuarioCreate UsuarioCreate 
* no response value expected for this operation
* */
// PATCH ROBUSTO: aceptar usuarioCreate, usuarioUpdate, body o campos sueltos
const usuariosIdPUT = ({ id, usuarioCreate, usuarioUpdate, body, nombre, usuario, Usuario, clave, Clave }) => new Promise(
  async (resolve, reject) => {
    try {
      const payload = usuarioCreate || usuarioUpdate || body || {
        nombre: nombre || Usuario,
        usuario: usuario || Usuario,
        clave: clave || Clave,
      };
      if (!payload || !payload.nombre || !payload.usuario) {
        return reject(Service.rejectResponse('Datos de usuario faltantes para actualización', 400));
      }
      const { nombre: n, usuario: u, clave: c } = payload;
      const [result] = await db.query(
        'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
        [n, u, c, id]
      );

      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Usuario no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Usuario actualizado correctamente' }));
    } catch (e) {
      const status = e.status ? e.status : (e.message && e.message.includes('no encontrado') ? 404 : 500);
      reject(Service.rejectResponse(
        e.message || 'Error interno al actualizar usuario',
        status,
      ));
    }
  },
);
/**
* Crear usuario
*
* usuarioCreate UsuarioCreate 
* no response value expected for this operation
* */
const usuariosPOST = ({ usuarioCreate, body, nombre, usuario, Usuario, clave, Clave }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🟢 usuariosPOST params recibidos:', { usuarioCreate, body, nombre, usuario, Usuario, clave, Clave });
      const payload = usuarioCreate || body || {
        nombre: nombre || Usuario,
        usuario: usuario || Usuario,
        clave: clave || Clave,
      };
      console.log('🟢 usuariosPOST payload construido:', payload);
      if (!payload || !payload.nombre || !payload.usuario || !payload.clave) {
        return reject(Service.rejectResponse('Campos requeridos: nombre, usuario, clave', 400));
      }
      const { nombre: n, usuario: u, clave: c } = payload;
      const [result] = await db.query(
        'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
        [n, u, c],
      );
      resolve(Service.successResponse({
        id: result.insertId,
        nombre: n,
        usuario: u,
        mensaje: 'Usuario creado correctamente'
      }, 201));
    } catch (e) {
      const status = e.status ? e.status : 500;
      console.error('❌ Error en usuariosPOST:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error interno al crear usuario',
        status,
      ));
    }
  },
);

/**
 * =============================================
 * MÉTODOS PERSONALIZADOS - APP IONIC
 * =============================================
 */

/**
 * Buscar fichaje activo
 * 
 * IdUsuario Integer 
 * returns Fichaje
 * */
const fichajesActivoGET = ({ IdUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🔍 Buscando fichaje activo para usuario:', IdUsuario);
      
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

      if (rows.length === 0) {
        console.log('📭 No hay fichaje activo');
        resolve(Service.successResponse(null));
      } else {
        console.log('✅ Fichaje activo encontrado:', rows[0].IdFichaje);
        resolve(Service.successResponse(rows[0]));
      }
    } catch (e) {
      console.error('❌ Error en fichajesActivoGET:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al buscar fichaje activo',
        e.status || 500,
      ));
    }
  },
);

/**
 * Obtener fichajes de hoy
 * 
 * IdUsuario Integer 
 * returns List
 * */
const fichajesHoyGET = ({ IdUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('📅 Obteniendo fichajes de hoy para usuario:', IdUsuario);
      
      const [rows] = await db.query(`
        SELECT f.*, t.Nombre as TrabajoNombre,
               TIMESTAMPDIFF(HOUR, f.FechaHoraEntrada, f.FechaHoraSalida) as HorasCalculadas
        FROM Fichajes f 
        LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo
        WHERE f.IdUsuario = ? 
          AND DATE(f.FechaHoraEntrada) = CURDATE()
        ORDER BY f.FechaHoraEntrada DESC
      `, [IdUsuario]);

      console.log(`✅ Encontrados ${rows.length} fichajes hoy`);
      resolve(Service.successResponse(rows));
    } catch (e) {
      console.error('❌ Error en fichajesHoyGET:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al obtener fichajes de hoy',
        e.status || 500,
      ));
    }
  },
);

/**
 * Obtener fichajes entre dos fechas (rango inclusivo)
 * desde YYYY-MM-DD
 * hasta YYYY-MM-DD
 * IdUsuario (opcional)
 * returns List
 */
const fichajesRangoGET = ({ desde, hasta, IdUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('[fichajesRangoGET] recibidos:', { desde, hasta, IdUsuario });
      if (!desde || !hasta) {
        return reject(Service.rejectResponse('Parámetros desde y hasta son obligatorios', 400));
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(desde) || !dateRegex.test(hasta)) {
        return reject(Service.rejectResponse('Formato de fecha inválido (YYYY-MM-DD)', 400));
      }
      if (desde > hasta) {
        return reject(Service.rejectResponse('El rango de fechas es inválido: desde > hasta', 400));
      }
      const start = `${desde} 00:00:00`;
      const end = `${hasta} 23:59:59`;
      const values = [start, end];
      let extra = '';
      if (IdUsuario != null) {
        extra = ' AND f.IdUsuario = ?';
        values.push(IdUsuario);
      }
      const sql = `SELECT f.*, TIMESTAMPDIFF(HOUR, f.FechaHoraEntrada, f.FechaHoraSalida) as HorasCalculadas
                   FROM Fichajes f
                   WHERE f.FechaHoraEntrada BETWEEN ? AND ?${extra}
                   ORDER BY f.FechaHoraEntrada DESC`;
      console.log('[fichajesRangoGET] SQL:', sql, 'values:', values);
      const [rows] = await db.query(sql, values);
      console.log('[fichajesRangoGET] Filas encontradas:', rows.length);
      resolve(Service.successResponse(rows));
    } catch (e) {
      console.error('[fichajesRangoGET] Error:', e.message || e);
      reject(Service.rejectResponse(e.message || 'Error al obtener fichajes por rango', e.status || 500));
    }
  },
);

/**
 * Iniciar fichaje
 * 
 * IdUsuario Integer 
 * IdTrabajo Integer 
 * GeolocalizacionLatitud number (optional)
 * GeolocalizacionLongitud number (optional)
 * no response value expected for this operation
 * */
const fichajesIniciarPOST = ({ IdUsuario, IdTrabajo, GeolocalizacionLatitud, GeolocalizacionLongitud }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🚀 Iniciando fichaje:', { IdUsuario, IdTrabajo });
      
      const [result] = await db.query(
        `INSERT INTO Fichajes 
         (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) 
         VALUES (NOW(), ?, ?, ?, ?)`,
        [IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud]
      );
      
      console.log('✅ Fichaje iniciado con ID:', result.insertId);
      resolve(Service.successResponse({
        IdFichaje: result.insertId,
        mensaje: 'Fichaje iniciado correctamente'
      }));
    } catch (e) {
      console.error('❌ Error en fichajesIniciarPOST:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al iniciar fichaje',
        e.status || 500,
      ));
    }
  },
);

/**
 * Finalizar fichaje
 * 
 * id Integer 
 * GeolocalizacionLatitud number (optional)
 * GeolocalizacionLongitud number (optional)
 * no response value expected for this operation
 * */
const fichajesFinalizarPUT = ({ id, GeolocalizacionLatitud, GeolocalizacionLongitud }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🛑 Finalizando fichaje ID:', id);
      
      const [result] = await db.query(
        `UPDATE Fichajes 
         SET FechaHoraSalida = NOW(),
             GeolocalizacionLatitud = ?,
             GeolocalizacionLongitud = ?,
             HorasTrabajadas = TIMESTAMPDIFF(HOUR, FechaHoraEntrada, NOW())
         WHERE IdFichaje = ?`,
        [GeolocalizacionLatitud, GeolocalizacionLongitud, id]
      );
      
      console.log('✅ Fichaje finalizado, filas afectadas:', result.affectedRows);
      resolve(Service.successResponse({ 
        mensaje: 'Fichaje finalizado correctamente',
        filasAfectadas: result.affectedRows
      }));
    } catch (e) {
      console.error('❌ Error en fichajesFinalizarPUT:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al finalizar fichaje',
        e.status || 500,
      ));
    }
  },
);

/**
 * Login de usuario
 * 
 * Usuario String 
 * Clave String 
 * returns Object
 * */
const usuariosLoginPOST = ({ Usuario, Clave }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🔐 Login attempt for user:', Usuario);
      
      const [rows] = await db.query(
        'SELECT IdUsuario, Nombre, Usuario FROM Usuarios WHERE Usuario = ? AND Clave = ?',
        [Usuario, Clave]
      );
      
      if (rows.length === 0) {
        console.log('❌ Login failed: credenciales incorrectas');
        return reject(Service.rejectResponse('Credenciales incorrectas', 401));
      }
      
      console.log('✅ Login successful for user:', rows[0].Nombre);
      resolve(Service.successResponse({
        mensaje: 'Login exitoso',
        usuario: rows[0]
      }));
    } catch (e) {
      console.error('❌ Error en usuariosLoginPOST:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error en el login',
        e.status || 500,
      ));
    }
  },
);

/**
 * Crear API Key
 * 
 * no response value expected for this operation
 * */
const apikeyPOST = () => new Promise(
  async (resolve, reject) => {
    try {
      console.log('🔑 Creando nueva API Key');
      const crypto = await import('crypto');
      const apiKey = crypto.randomBytes(32).toString('hex');
      
      const [result] = await db.query(
        'INSERT INTO ApiKey (`Key`, created_at) VALUES (?, NOW())',
        [apiKey]
      );

      console.log('API Key creada con ID:', result.insertId);
      resolve(Service.successResponse({
        id: result.insertId,
        apiKey: apiKey,
        mensaje: 'API Key creada correctamente'
      }));
    } catch (e) {
      console.error('Error en apikeyPOST:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al crear API Key',
        e.status || 500,
      ));
    }
  },
);

// Cerrar fichajes vencidos
const cerrarFichajesVencidos = () => new Promise(
  async (resolve, reject) => {
    try {
      console.log('Cerrando fichajes con más de 12 horas...');
      
      const [result] = await db.query(`
        UPDATE Fichajes 
        SET FechaHoraSalida = NOW(),
            HorasTrabajadas = TIMESTAMPDIFF(MINUTE, FechaHoraEntrada, NOW()) / 60.0
        WHERE FechaHoraSalida IS NULL 
          AND FechaHoraEntrada <= DATE_SUB(NOW(), INTERVAL 12 HOUR)
      `);
      
      console.log(`Fichajes cerrados automáticamente: ${result.affectedRows}`);
      resolve(Service.successResponse({ 
        mensaje: `Fichajes cerrados: ${result.affectedRows}` 
      }));
    } catch (e) {
      console.error('Error cerrando fichajes vencidos:', e.message);
      reject(Service.rejectResponse(
        e.message || 'Error al cerrar fichajes vencidos',
        e.status || 500,
      ));
    }
  },
);

// module.exports = {
//   fichajesGET,
//   fichajesIdDELETE,
//   fichajesIdGET,
//   fichajesIdPUT,
//   fichajesPOST,
//   trabajosGET,
//   trabajosIdDELETE,
//   trabajosIdGET,
//   trabajosIdPUT,
//   trabajosPOST,
//   usuariosGET,
//   usuariosIdDELETE,
//   usuariosIdGET,
//   usuariosIdPUT,
//   usuariosPOST,
// };

export default {
  fichajesGET,
  fichajesIdDELETE,
  fichajesIdGET,
  fichajesIdPUT,
  fichajesPOST,
  trabajosGET,
  trabajosIdDELETE,
  trabajosIdGET,
  trabajosIdPUT,
  trabajosPOST,
  usuariosGET,
  usuariosIdDELETE,
  usuariosIdGET,
  usuariosIdPUT,
  usuariosPOST,
  fichajesActivoGET,
  fichajesHoyGET,
  fichajesRangoGET,
  fichajesIniciarPOST,
  fichajesFinalizarPUT,
  usuariosLoginPOST,
  apikeyPOST,
  cerrarFichajesVencidos
};
