import mongoose from 'mongoose';

const PrestacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, uppercase: true, trim: true },
  valorParticular: { type: Number, default: 0 }, // Solo se usa si no hay OS
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Prestacion', PrestacionSchema);