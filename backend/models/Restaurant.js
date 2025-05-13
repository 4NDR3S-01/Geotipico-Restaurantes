const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  specialties: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ''
  },
  horario: {
    type: String,
    default: 'Lun-Dom: 9:00-22:00'
  },
  telefono: {
    type: String,
    default: 'No disponible'
  },
  city: {
    type: String,
    default: 'Manta'
  },
  // Campos para importación de OpenStreetMap
  osm_id: String,
  source: {
    type: String,
    default: 'manual'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices optimizados
restaurantSchema.index({ coordinates: '2dsphere' });
restaurantSchema.index({ osm_id: 1 }, { sparse: true });
restaurantSchema.index({ name: 'text', description: 'text', specialties: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);