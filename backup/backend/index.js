require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', authRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
