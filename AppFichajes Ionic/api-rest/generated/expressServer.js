// const { Middleware } = require('swagger-express-middleware');

// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const swaggerUI = require('swagger-ui-express');
// const jsYaml = require('js-yaml');
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const OpenApiValidator = require('express-openapi-validator');
// const logger = require('./logger');
// const config = require('./config');

import http from 'http';
import fs from 'fs';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import jsYaml from 'js-yaml';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import OpenApiValidator from 'express-openapi-validator';
import logger from './logger.js';
import config from './config.js';

import apiKeyMiddleware from './middlewares/apikey.js';
import usuariosRouter from './routes/usuarios.js';
import fichajesRouter from './routes/fichajes.js';
import trabajosRouter from './routes/trabajos.js';
import apikeyRouter from './routes/apikey.js';
import openApiRouter from './utils/openapiRouter.js';
// const apiKeyMiddleware = require('./middlewares/apikey');
// const usuariosRouter = require('./routes/usuarios');
// const fichajesRouter = require('./routes/fichajes');
// const trabajosRouter = require('./routes/trabajos');
// const apikeyRouter = require('./routes/apikey');
// const openApiRouter = require('./utils/openapiRouter');

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class ExpressServer {
  constructor(port, openApiYaml) {
    console.log('🔧 ExpressServer constructor called with port:', port);
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;

    console.log('Verifying OpenAPI file:', openApiYaml);

    // Verifica que el archivo existe
    if (!fs.existsSync(openApiYaml)) {
      console.error('OpenAPI file does not exist:', openApiYaml);
      process.exit(1);
    }

    try {
      const yamlString = fs.readFileSync(openApiYaml, 'utf8');
      console.log('OpenAPI file exists, size:', yamlString.length);
      this.schema = jsYaml.load(yamlString);
      console.log('OpenAPI YAML parsed successfully');
      console.log('OpenAPI info:', this.schema.info);
    } catch (err) { 
      console.error('Error parsing OpenAPI YAML:', err);
      logger.error('Error parsing OpenAPI YAML', { error: err });
      process.exit(1);
    }
    this.setupMiddleware();
  }

  setupMiddleware() {
  console.log('setupMiddleware start');

  // Manejo de errores global AL INICIO
    this.app.use((err, req, res, next) => {
      console.error('Global error handler:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
  
  this.app.use(cors());
  this.app.use(express.json({ limit: '14MB' }));
  this.app.use(express.urlencoded({ extended: false }));
  this.app.use(cookieParser());

  // Rutas básicas de verificación
  this.app.get('/hello', (req, res) => {
    console.log('/hello route hit');
    res.send(`Hello World. path: ${this.openApiPath}`);
  });

  this.app.get('/openapi', (req, res) => {
    console.log('/openapi route hit');
    res.sendFile(path.join(__dirname, 'api', 'openapi.yaml'));
  });

  this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));

  
  /*
  console.log('OpenApiValidator middleware path:', this.openApiPath);
  console.log('Operation handlers path:', path.join(__dirname));

  this.app.use(
    OpenApiValidator.middleware({
      apiSpec: this.openApiPath,
      operationHandlers: path.join(__dirname, 'controllers'),
      validateRequests: false,
      validateResponses: false,
    }),
  );
  */

  // Rutas manuales
  console.log('Setting up manual routes...');
  this.app.use('/usuarios', apiKeyMiddleware, usuariosRouter);
  this.app.use('/fichajes', apiKeyMiddleware, fichajesRouter);
  this.app.use('/trabajos', apiKeyMiddleware, trabajosRouter);
  this.app.use('/apikey', apikeyRouter);

  // this.app.use(openApiRouter());

  // Ruta de health check simple
  this.app.get('/health', (req, res) => {
    console.log('Health check route hit');
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  console.log('setupMiddleware end');
}

  launch() {
    console.log('launch start');
    
    try {
      
      this.app.use((err, req, res, next) => {
        console.error('Final error handler:', {
          message: err.message,
          stack: err.stack,
          status: err.status
        });
        res.status(err.status || 500).json({
          message: err.message || 'Internal Server Error',
          errors: err.errors || '',
        });
      });

      console.log('before createServer');
      
      this.server = http.createServer(this.app);
      
      // Maneja errores del servidor
      this.server.on('error', (error) => {
        console.error('Server error event:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        logger.error('Server error event', { 
          code: error.code,
          message: error.message,
          stack: error.stack 
        });
      });

      this.server.on('listening', () => {
        console.log('Server listening event fired');
      });

      console.log('Starting server on port:', this.port);
      
      this.server.listen(this.port, () => {
        console.log(`Server successfully listening on port ${this.port}`);
        logger.info(`Server started on port ${this.port}`);
      });

    } catch (error) {
      console.error('Catch block in launch:', {
        message: error.message,
        stack: error.stack
      });
      logger.error('Launch method failed', { 
        message: error.message, 
        stack: error.stack 
      });
    }
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

// module.exports = ExpressServer;
export default ExpressServer;
