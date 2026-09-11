/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

import Controller from './Controller.js';

class DefaultController {
  constructor(service) {
    if (!service) {
      throw new Error('Service is undefined in DefaultController constructor');
    }
    this.service = service;
    console.log('✅ DefaultController initialized with service methods:', Object.keys(service));
  
  }

  // Métodos existentes
  async apikeyKeyGET(request, response) {
    await Controller.handleRequest(request, response, this.service.apikeyKeyGET);
  }

  async fichajesGET(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesGET);
  }

  async fichajesIdDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesIdDELETE);
  }

  async fichajesIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesIdGET);
  }

  async fichajesIdPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesIdPUT);
  }

  async fichajesPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesPOST);
  }

  async trabajosGET(request, response) {
    await Controller.handleRequest(request, response, this.service.trabajosGET);
  }

  async trabajosIdDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.trabajosIdDELETE);
  }

  async trabajosIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.trabajosIdGET);
  }

  async trabajosIdPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.trabajosIdPUT);
  }

  async trabajosPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.trabajosPOST);
  }

  async usuariosGET(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosGET);
  }

  async usuariosIdDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosIdDELETE);
  }

  async usuariosIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosIdGET);
  }

  async usuariosIdPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosIdPUT);
  }

  async usuariosPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosPOST);
  }

  // =============================================
  // MÉTODOS PERSONALIZADOS - APP IONIC
  // =============================================

  async fichajesActivoGET(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesActivoGET);
  }

  async fichajesHoyGET(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesHoyGET);
  }

  async fichajesRangoGET(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesRangoGET);
  }

  async fichajesIniciarPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesIniciarPOST);
  }

  async fichajesFinalizarPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.fichajesFinalizarPUT);
  }

  async usuariosLoginPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.usuariosLoginPOST);
  }

  async apikeyPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.apikeyPOST);
  }
}

// Exportación para el sistema de OpenAPI
export default DefaultController;

