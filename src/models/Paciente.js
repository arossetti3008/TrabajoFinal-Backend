import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
    uppercase: true,
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    minLength: [2, 'El apellido debe tener al menos 2 caracteres'],
    uppercase: true,
    trim: true
  },
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true, 
    trim: true
  },
  celular: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  obraSocial:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ObraSocial',
      default: null
    }, 
  //  {
  //   type: String,
  //   default: 'particular',
  //   lowercase: true,
  //   trim: true
  // },
  odontograma: {
    type: Map,
    of: Object,
    default: {}
  },

  activo: {
    type: Boolean,
    default: true,
  }
  
}, 

{
  timestamps: true 
});

PacienteSchema.set("toJSON", {
    getters: true,
    virtuals: true
});

export default mongoose.model('Paciente', PacienteSchema);