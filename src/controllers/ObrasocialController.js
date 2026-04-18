import { crearObraSocialService, getObrasSocialesService, actualizarObraSocialService, cambiarEstadoOSService } from "../services/ObraSocialService.js";
import catchAsync from "../middlewares/catchAsync.js";

export const registrarObraSocial = catchAsync(async (req, res) => {
    const saved = await crearObraSocialService(req.body);
    res.status(201).json(saved);
});

export const obtenerObrasSociales = catchAsync(async (req, res) => {
    const lista = await getObrasSocialesService();
    res.status(200).json(lista);
});

export const actualizarObraSocial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const actualizado = await actualizarObraSocialService(id, req.body);
    res.status(200).json(actualizado);
});

export const cambiarEstadoOS = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    const actualizado = await cambiarEstadoOSService(id, activo);
    res.status(200).json(actualizado);
});