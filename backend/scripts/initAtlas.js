const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Script para inicializar y verificar la conexión con MongoDB Atlas
 */
const initMongoDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    
    // Verificar que existe la URI de conexión
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ Error: Variable de entorno MONGODB_URI no definida');
      console.log('Por favor, crea un archivo .env con tu cadena de conexión de MongoDB Atlas');
      console.log('Ejemplo: MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/restaurantes');
      process.exit(1);
    }
    
    // Intentar la conexión con más opciones para diagnóstico
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Conexión a MongoDB Atlas establecida correctamente');
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    
    // Listar colecciones disponibles
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📋 Colecciones disponibles:');
    if (collections.length === 0) {
      console.log('   - No hay colecciones (base de datos vacía)');
    } else {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    // Desconectar
    console.log('\n👋 Cerrando conexión...');
    await mongoose.disconnect();
    console.log('✅ Proceso completado');
    
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:');
    console.error(error);
    
    // Proporcionar ayuda de diagnóstico según el tipo de error
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔍 Posibles causas:');
      console.log('1. La cadena de conexión es incorrecta');
      console.log('2. Hay un problema de red');
      console.log('3. Tu IP no está en la lista blanca de MongoDB Atlas');
      console.log('\n💡 Sugerencia: Verifica tu cadena de conexión y asegúrate de que tu IP esté permitida en MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

initMongoDB();