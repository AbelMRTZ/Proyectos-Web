// middlewares/apikey.js
import db from '../db.js';

export default async function apiKeyMiddleware(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apikey || req.params.key;
  
  console.log('=== API KEY MIDDLEWARE DEBUG ===');
  console.log('Received key:', key);
  console.log('Key length:', key?.length);
  console.log('Headers:', req.headers);
  
  if (!key) return res.status(401).json({ error: 'ApiKey required' });

  try {
    console.log('Executing SQL query...');
    const [rows] = await db.query('SELECT * FROM ApiKey WHERE `Key` = ?', [key]);
    
    console.log('Rows found:', rows.length);
    console.log('Rows content:', JSON.stringify(rows, null, 2));
    
    if (rows.length === 0) {
      console.log('No matching key found in database');
      return res.status(403).json({ error: 'Invalid ApiKey' });
    }
    
    console.log('Key validated successfully');
    next();
  } catch (err) {
    console.error('Database error details:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('SQL State:', err.sqlState);
    res.status(500).json({ error: 'db error' });
  }
}


// Crear una carpeta routes con la siguientes estructura:
// routes
//   |-- routes/fichajes.js
//   |-- routes/usuarios.js
//   |-- routes/trabajos.js
//   |-- routes/apikeys.js  --> para crear, listar o gestionar claves, ruta pública o protegidas.
// Cada fichero exporta un router de express con las rutas correspondientes
// Luego en expressServer.js importas y usas los routers
// import apiKeyMiddleware from './middlewares/apikey.js';
// import fichajesRouter from './routes/fichajes.js';
// this.app.use('/fichajes', apiKeyMiddleware, fichajesRouter);  // proteger rutas con el middleware
// this.app.use('/apikeys', apikeysRouter);  // ruta pública o protegida según decidas
// etc...




