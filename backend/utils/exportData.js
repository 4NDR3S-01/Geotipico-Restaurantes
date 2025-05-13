/**
 * Script para exportar datos de restaurantes a JSON
 * Útil para respaldos o migración
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelo
const Restaurant = require('../models/Restaurant');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    return false;
  }
};

// Exportar datos
const exportData = async () => {
  try {
    // Conectar a DB
    const connected = await connectDB();
    if (!connected) return;
    
    // Obtener todos los restaurantes
    const restaurants = await Restaurant.find({});
    console.log(`Encontrados ${restaurants.length} restaurantes`);
    
    if (restaurants.length === 0) {
      console.log('No hay datos para exportar');
      process.exit(0);
    }
    
    // Crear carpeta de backup si no existe
    const backupDir = path.join(__dirname, '../backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Nombre de archivo con fecha
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = path.join(backupDir, `restaurants_${timestamp}.json`);
    
    // Guardar archivo
    fs.writeFileSync(filename, JSON.stringify(restaurants, null, 2));
    console.log(`✅ Datos exportados a ${filename}`);
    
    // Desconectar
    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error exportando datos:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  exportData().finally(() => process.exit(0));
}

module.exports = { exportData };