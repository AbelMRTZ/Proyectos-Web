// const DefaultController = require('./DefaultController');
import DefaultController from './DefaultController.js'; // Importar por bloques separados

// module.exports = {
//   DefaultController,
// };
console.log('🔍 DefaultController type:', typeof DefaultController);
console.log('🔍 Is DefaultController a class?', DefaultController.prototype?.constructor?.name);

export default DefaultController;
