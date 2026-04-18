import Historial from '../models/Historial.js';
import Turno from '../models/Agenda.js';
import Agenda from '../models/Agenda.js';

export const getHistorialByPacienteService = async (pacienteId) => {
    // Buscamos y poblamos la prestación para tener el nombre en la tabla
    return await Historial.find({ paciente: pacienteId })
        .populate('prestacion')
        .sort({ fechaRealizacion: -1 });
};

export const crearEvolucionService = async (datos) => {
    const nuevaEvolucion = new Historial(datos);
    const guardado = await nuevaEvolucion.save();

    // Si la evolución viene de un turno, lo finalizamos automáticamente
    if (datos.turno) {
        await Agenda.findByIdAndUpdate(datos.turno, { estado: 'FINALIZADO' });
    }

    return guardado;
};