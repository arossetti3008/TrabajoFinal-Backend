import Turno from "../models/Turno.js";

export const getTurnosService = async () => {
    // Es vital el populate para que el front no reciba solo IDs y se rompa al leer .nombre
    return await Turno.find()
        .populate('paciente', 'nombre apellido dni')
        .populate('prestacion', 'nombre valor');
};

export const crearTurnoService = async (data) => {
    const nuevoTurno = new Turno(data);
    await nuevoTurno.save();
    // Retornamos el turno poblado para que el calendario se actualice al instante
    return await Turno.findById(nuevoTurno._id)
        .populate('paciente', 'nombre apellido dni')
        .populate('prestacion', 'nombre valor');
};