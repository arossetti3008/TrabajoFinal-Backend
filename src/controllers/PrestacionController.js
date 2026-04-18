import { crearPrestacionService, getPrestacionesService, actualizarPrestacionService, eliminarPrestacionService, cambiarEstadoPrestacionService } from "../services/PrestacionService.js";
import catchAsync from "../middlewares/catchAsync.js";

export const registrarPrestacion = catchAsync(async (req, res) => {
    const prestacionData = req.body;
    const saved = await crearPrestacionService(prestacionData);
    res.status(201).json(saved);
});

export const obtenerPrestaciones = catchAsync(async (req, res) => {
    const lista = await getPrestacionesService();
    res.status(200).json(lista);
});

export const actualizarPrestacion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const actualizado = await actualizarPrestacionService(id, req.body);
    res.status(200).json(actualizado);
});

export const eliminarPrestacion = catchAsync(async (req, res) => {
    const { id } = req.params;
    // Bug corregido: ahora llama al servicio correcto
    const actualizado = await eliminarPrestacionService(id);
    res.status(200).json(actualizado);
});

export const cambiarEstadoPrestacion = catchAsync(async (req, res) => {
    const { activo } = req.body;
    const actualizado = await cambiarEstadoPrestacionService(req.params.id, activo);
    res.json(actualizado);
});