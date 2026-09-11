import config from './config.js';
import logger from './logger.js';
import ExpressServer from './expressServer.js';

console.log('🔍 Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);

let expressServer;

const closeServer = async () => {
  if (expressServer) {
    console.log('🛑 Closing server...');
    await expressServer.close();
  }
};

const launchServer = async () => {
  try {
    expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    logger.error('Express Server failure', error.message);
    console.error('Error details:', error);
    await closeServer();
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT (Ctrl+C)');
  await closeServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM');
  await closeServer();
  process.exit(0);
});

process.on('SIGTSTP', async () => {  // Ctrl+Z
  console.log('\n🛑 Received SIGTSTP (Ctrl+Z) - Use Ctrl+C instead to properly close');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

launchServer().catch(error => {
  console.error('Launch failed:', error);
  process.exit(1);
});


// Actualmente esta hecho para que el servidor
// devuelva los json generados en las routes.
// Abria que modificar los routes para que se
// conecten a la base de datos y devuelvan
// los datos reales

// Iniciar servidor con "node index.js" y mysql con "homebrew services start mysql"
// Para hacer un test del api desde la terminal: "curl -H "x-api-key: Test-Key" http://localhost:3000/usuarios"