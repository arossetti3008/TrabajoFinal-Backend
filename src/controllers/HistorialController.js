import Historial from '../models/Historial.js';
import Agenda from '../models/Agenda.js';
import catchAsync from "../middlewares/catchAsync.js";

export const registrarEvolucion = catchAsync(async (req, res) => {
  const { pacienteId, turnoId, prestacionId, observaciones, fechaRealizacion } = req.body;
  const nuevaEvolucion = new Historial({
    paciente: pacienteId,
    prestacion: prestacionId,
    turno: turnoId,
    observaciones,
    fechaRealizacion
  });
  await nuevaEvolucion.save();
  
  if (turnoId) await Agenda.findByIdAndUpdate(turnoId, { estado: 'FINALIZADO' });
  
  res.status(201).json({ success: true, data: nuevaEvolucion });
});

export const obtenerHistorialPaciente = catchAsync(async (req, res) => {
  const lista = await Historial.find({ paciente: req.params.id })
    .populate('prestacion')
    .sort({ fechaRealizacion: -1 });
  res.status(200).json(lista || []); 
});