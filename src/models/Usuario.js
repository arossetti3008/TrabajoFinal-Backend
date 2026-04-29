import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  permisos: {
    pacientes: {
      ver: { type: Boolean, default: false },
      crear: { type: Boolean, default: false },
      editar: { type: Boolean, default: false },
      eliminar: { type: Boolean, default: false }
    },
    agenda: {
      ver: { type: Boolean, default: false },
      crear: { type: Boolean, default: false },
      editar: { type: Boolean, default: false },
      eliminar: { type: Boolean, default: false }
    },
    obras: {
      ver: { type: Boolean, default: false },
      crear: { type: Boolean, default: false },
      editar: { type: Boolean, default: false },
      eliminar: { type: Boolean, default: false }
    },
    prestaciones: {
      ver: { type: Boolean, default: false },
      crear: { type: Boolean, default: false },
      editar: { type: Boolean, default: false },
      eliminar: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
