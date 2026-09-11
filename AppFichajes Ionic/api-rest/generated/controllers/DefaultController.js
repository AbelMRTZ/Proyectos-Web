/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

// const Controller = require('./Controller');
// const service = require('../services/DefaultService');

import Controller from './Controller.js';
import service from '../services/DefaultService.js';

export const apikeyKeyGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyKeyGET);
};

export const fichajesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesGET);
};

export const fichajesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdDELETE);
};

export const fichajesIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdGET);
};

export const fichajesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdPUT);
};

export const fichajesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesPOST);
};

export const trabajosGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosGET);
};

export const trabajosIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdDELETE);
};

export const trabajosIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdGET);
};

export const trabajosIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdPUT);
};

export const trabajosPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosPOST);
};

export const usuariosGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosGET);
};

export const usuariosIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdDELETE);
};

export const usuariosIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdGET);
};

export const usuariosIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdPUT);
};

export const usuariosPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosPOST);
};


// module.exports = {
//   apikeyKeyGET,
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

// export default {
//   apikeyKeyGET,
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