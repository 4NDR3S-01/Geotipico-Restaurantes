const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Añadir opciones optimizadas para conexión
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantes', options);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;