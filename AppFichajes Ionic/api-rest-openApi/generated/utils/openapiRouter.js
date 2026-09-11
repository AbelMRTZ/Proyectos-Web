// openApiRouter.js - VERSIÓN CORREGIDA
import logger from '../logger.js';
import DefaultController from '../controllers/index.js';  // ✅ Importar directamente
import DefaultService from '../services/index.js';       // ✅ Importar directamente

function handleError(err, request, response, next) {
  logger.error(err);
  const code = err.code || 400;
  response.status(code);
  response.error = err;
  next(JSON.stringify({
    code,
    error: err,
  }));
}

function openApiRouter() {
  return async (request, response, next) => {
    try {
      if (request.openapi === undefined || request.openapi.schema === undefined) {
        next();
        return;
      }
      
      const controllerName = request.openapi.schema['x-openapi-router-controller'];
      const serviceName = request.openapi.schema['x-openapi-router-service'];
      
      // ✅ VERIFICACIONES MEJORADAS
      console.log('🔍 Controller Name:', controllerName);
      console.log('🔍 Service Name:', serviceName);
      console.log('🔍 DefaultController type:', typeof DefaultController);
      console.log('🔍 DefaultService type:', typeof DefaultService);
      console.log('🔍 Is DefaultController a class?', DefaultController?.prototype?.constructor?.name);
      
      // ✅ VERIFICAR que los nombres coinciden con lo que tenemos
      if (controllerName !== 'DefaultController' || serviceName !== 'DefaultService') {
        handleError(`Controller '${controllerName}' or Service '${serviceName}' not supported`, 
          request, response, next);
        return;
      }
      
      // ✅ VERIFICAR que son constructores
      if (typeof DefaultController !== 'function') {
        handleError('DefaultController is not a constructor function', 
          request, response, next);
        return;
      }
      
      console.log('✅ Instantiating: new DefaultController(DefaultService)');
      
      // ✅ INSTANCIACIÓN DIRECTA - sin usar corchetes
      const apiController = new DefaultController(DefaultService);
      
      // ✅ VERIFICAR que la instancia se creó correctamente
      console.log('✅ Controller instance created:', apiController);
      console.log('✅ Service in controller:', apiController.service);
      
      const controllerOperation = request.openapi.schema.operationId;
      console.log(`✅ Calling: apiController.${controllerOperation}()`);
      
      // ✅ VERIFICAR que el método existe
      if (typeof apiController[controllerOperation] !== 'function') {
        handleError(`Method '${controllerOperation}' not found in controller`, 
          request, response, next);
        return;
      }
      
      await apiController[controllerOperation](request, response, next);
      
    } catch (error) {
      console.error('❌ Error in openApiRouter:', error);
      const err = { code: 500, error: error.message };
      handleError(err, request, response, next);
    }
  };
}

export default openApiRouter;