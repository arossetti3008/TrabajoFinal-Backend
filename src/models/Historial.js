import mongoose from 'mongoose';

const HistorialSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  prestacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestacion', required: true },
  obraSocial: { type: mongoose.Schema.Types.ObjectId, ref: 'ObraSocial' },
  // *** CORRECCIÓN ANTIGRAVITY ***
  // turno: { type: mongoose.Schema.Types.ObjectId, ref: 'Turno' },
  turno: { type: mongoose.Schema.Types.ObjectId, ref: 'Agenda' },
  codigoAplicado: { type: String }, // Código específico de la OS en ese momento
  valorAplicado: { type: Number },  // Valor cobrado (particular o convenio)
  observaciones: { type: String },
  fechaRealizacion: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Historial', HistorialSchema);