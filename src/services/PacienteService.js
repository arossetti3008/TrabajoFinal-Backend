import Paciente from '../models/Paciente.js';

export const crearPacienteService = async (pacienteData) => {
    // creo instancia de la prestacion
    const newPaciente = new Paciente(pacienteData);
    // guardo la prestacion
    const savedPaciente = await newPaciente.save();

    return savedPaciente;
};

export const getPacientesService = async (soloActivos) => {
    return await Paciente.find(soloActivos === 'true' ? { activo: true } : {});
};

export const getPacienteByIdService = async (id) => {
    return await Paciente.findById(id).populate({
        path: 'obraSocial',
        populate: { path: 'nomenclador.prestacion' }
    });
};

export const actualizarPacienteService = async (id, data) => {
    return await Paciente.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// Servicio específico para inactivar (borrado lógico)
export const cambiarEstadoPacienteService = async (id, estado) => {
    return await Paciente.findByIdAndUpdate(id, { activo: estado }, { new: true, runValidators: true });
};