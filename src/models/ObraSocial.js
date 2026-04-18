import mongoose from 'mongoose';

const ObraSocialSchema = new mongoose.Schema({
  razonSocial: { type: String, required: true, uppercase: true },
  plan: { type: String, required: true },
  // Nomenclador específico de esta OS
  nomenclador: [{
    prestacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestacion' },
    codigoPropio: { type: String, required: true }, // El código que pide la OS
    valorConvenio: { type: Number, required: true } // Lo que la OS paga al consultorio
  }],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('ObraSocial', ObraSocialSchema);