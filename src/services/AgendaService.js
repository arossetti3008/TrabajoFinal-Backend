import Agenda from "../models/Agenda.js";

// GET: Obtener citas con datos de pacientes y prestaciones
export const getAgendaService = async () => {
    return await Agenda.find()
        .populate('paciente', 'nombre apellido dni')
        .populate('prestacion', 'nombre valor');
};

// POST: Crear cita 
export const crearCitaService = async (citaData) => {
    const { start, end } = citaData;

    // Validación lógica: ¿Hay solapamiento? (Solo contra turnos NO cancelados)
    const solapado = await Agenda.findOne({
        estado: { $ne: 'CANCELADO' },
        $or: [{ start: { $lt: end }, end: { $gt: start } }]
    });
if (solapado) throw new Error("El horario ya está ocupado por otro turno.");

    const nuevaCita = new Agenda(citaData);
    return await nuevaCita.save();
};

export const actualizarCitaService = async (id, data) => {
  const { start, end } = data;
    // Validamos solapamiento EXCLUYENDO el turno actual que estamos editando
    if (start && end) {
        const solapado = await Agenda.findOne({
            _id: { $ne: id }, // Que no sea el mismo que edito
            estado: { $ne: 'CANCELADO' },
            $or: [{ start: { $lt: end }, end: { $gt: start } }]
        });
        if (solapado) throw new Error("El nuevo horario choca con otro turno.");
    }

    return await Agenda.findByIdAndUpdate(id, data, { new: true })
        .populate('paciente', 'nombre apellido dni')
        .populate('prestacion', 'nombre valor');
};

export const eliminarCitaService = async (id) => {
    return await Agenda.findByIdAndDelete(id);
};