import Prestacion from "../models/Prestacion.js";

export const crearPrestacionService = async (prestacionData) => {
    const newPrestacion = new Prestacion(prestacionData);
    const savedPrestacion = await newPrestacion.save();
    return savedPrestacion;
};

export const getPrestacionesService = async () => {
    return await Prestacion.find();
};

export const actualizarPrestacionService = async (id, data) => {
    return await Prestacion.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const cambiarEstadoPrestacionService = async (id, estado) => {
    return await Prestacion.findByIdAndUpdate(id, { activo: estado }, { new: true, runValidators: true });
};

export const eliminarPrestacionService = async (id) => {
    return await Prestacion.findByIdAndDelete(id);
};