import { crearPacienteService, getPacientesService, actualizarPacienteService, cambiarEstadoPacienteService, getPacienteByIdService } from '../services/PacienteService.js';
import catchAsync from "../middlewares/catchAsync.js";
import AppError from "../utils/AppError.js";

export const registrarPaciente = catchAsync(async (req, res) => {
    const pacienteData = req.body;
    const savedPaciente = await crearPacienteService(pacienteData);
    res.status(201).json(savedPaciente);
});

export const obtenerPacientes = catchAsync(async (req, res) => {
    const lista = await getPacientesService(req.query.soloActivos);
    res.status(200).json(lista);
});

export const obtenerPacientePorId = catchAsync(async (req, res) => {
    const { id } = req.params;
    const paciente = await getPacienteByIdService(id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
    res.status(200).json(paciente);
});

export const actualizarPaciente = catchAsync(async (req, res) => {
    const { id } = req.params;
    const actualizado = await actualizarPacienteService(id, req.body);
    res.status(200).json(actualizado);
});

export const cambiarEstado = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;

    // Validación solicitada para evitar falsos "undefined"
    if (activo === undefined) {
        throw new AppError("El campo 'activo' es obligatorio", 400);
    }

    const actualizado = await cambiarEstadoPacienteService(id, activo);
    res.status(200).json(actualizado);
});