const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');
const importRoutes = require('./routes/importRoutes');

// Crear la app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Determinar el entorno
const isProduction = process.env.NODE_ENV === 'production';

// CORS configurado según entorno
const corsOptions = {
  origin: isProduction 
    ? ['https://geotipico.vercel.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de seguridad y optimización
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false // Desactivado para permitir imágenes remotas
}));
app.use(compression());
app.use(express.json({ limit: '1mb' })); // Limitar tamaño de payload
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Logging configurado según entorno
if (isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rutas API
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/import', importRoutes);

// Ruta de estado/health check
app.get(['/health', '/api/health'], (_, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir frontend en producción (si está en la misma carpeta)
if (isProduction && fs.existsSync(path.join(__dirname, '../build'))) {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Manejar 404 para rutas API
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta API no encontrada', 
    path: req.originalUrl 
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  if (!isProduction) {
    console.error(err.stack);
  }

  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    error: isProduction && statusCode === 500 
      ? 'Error interno del servidor' 
      : err.message || 'Error inesperado',
    status: statusCode
  });
});

// Iniciar servidor con manejo de errores por puerto ocupado
const startServer = async () => {
  try {
    await connectDB();
    
    // Intentar iniciar en el puerto principal
    let currentPort = PORT;
    const maxAttempts = 10;
    
    const tryPort = (port, attempt = 1) => {
      const server = app.listen(port)
        .on('listening', () => {
          console.log(`✅ Servidor ejecutándose en el puerto ${port}`);
          console.log(`🌐 Modo: ${isProduction ? 'producción' : 'desarrollo'}`);
          console.log(`🔗 API disponible en: http://localhost:${port}/api`);
          
          // Configurar cierre graceful
          const shutdown = async () => {
            console.log('🛑 Cerrando servidor...');
            server.close(async () => {
              console.log('👋 Cerrando conexión a MongoDB...');
              await mongoose.connection.close();
              console.log('✅ Servidor detenido correctamente');
              process.exit(0);
            });
            
            // Forzar cierre si tarda demasiado
            setTimeout(() => {
              console.error('⚠️ Cierre forzado por timeout');
              process.exit(1);
            }, 5000);
          };
          
          // Capturar señales de terminación
          process.on('SIGTERM', shutdown);
          process.on('SIGINT', shutdown);
        })
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
            console.log(`⚠️ Puerto ${port} en uso, intentando con ${port + 1}...`);
            server.close();
            tryPort(port + 1, attempt + 1);
          } else if (attempt >= maxAttempts) {
            console.error(`❌ No se pudo encontrar un puerto libre después de ${maxAttempts} intentos.`);
            process.exit(1);
          } else {
            console.error(`❌ Error al iniciar el servidor: ${err.message}`);
            process.exit(1);
          }
        });
    };
    
    tryPort(currentPort);
    
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();