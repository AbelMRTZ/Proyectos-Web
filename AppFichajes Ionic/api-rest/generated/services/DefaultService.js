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
const trabajosIdPUT = ({ id, trabajoUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { nombre } = trabajoUpdate;
      const [result] = await db.query(
        'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?',
        [nombre, id]
      );

      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Trabajo no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Trabajo actualizado correctamente' }));
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
* Crear trabajo
*
* trabajoCreate TrabajoCreate 
* no response value expected for this operation
* */
const trabajosPOST = ({ trabajoCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { nombre } = trabajoCreate;
      const [result] = await db.query(
        'INSERT INTO Trabajos (Nombre) VALUES (?)',
        [nombre],
      );
      resolve(Service.successResponse({
        id: result.insertId,
        mensaje: 'Trabajo creado correctamente'
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
const usuariosIdPUT = ({ id, usuarioUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { nombre, usuario, clave } = usuarioUpdate;
      const [result] = await db.query(
        'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
        [nombre, usuario, clave, id]
      );

      if (result.affectedRows === 0)
        return reject(Service.rejectResponse('Usuario no encontrado', 404));

      resolve(Service.successResponse({ mensaje: 'Usuario actualizado correctamente' }));
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
* Crear usuario
*
* usuarioCreate UsuarioCreate 
* no response value expected for this operation
* */
const usuariosPOST = ({ usuarioCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      // Añadido mio
      const { nombre, usuario, clave } = usuarioCreate;
      const [result] = await db.query(
        'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
        [nombre, usuario, clave],
      );
      resolve(Service.successResponse({
        id: result.insertId,
        mensaje: 'Usuario creado correctamente'
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
};
