import mongoose from 'mongoose';

const AgendaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: [true, 'La cita debe estar asociada a un paciente']
  },
  prestacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestacion',
    required: [true, 'Debe especificar la prestación a realizar']
  },
  start: {
    type: Date,
    required: [true, 'La fecha/hora de inicio es obligatoria']
  },
  end: {
    type: Date,
    required: [true, 'La fecha/hora de fin es obligatoria']
  },
  estado: {
    type: String,
    // *** CORRECCIÓN ANTIGRAVITY ***
    // enum: ['PENDIENTE', 'ATENDIDO', 'CANCELADO', 'FINALIZADO'],
    enum: ['PENDIENTE', 'CANCELADO', 'FINALIZADO'],
    default: 'PENDIENTE',
    uppercase: true
  },
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Agenda', AgendaSchema);