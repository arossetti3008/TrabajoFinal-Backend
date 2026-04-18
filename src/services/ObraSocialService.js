import ObraSocial from "../models/ObraSocial.js";

export const crearObraSocialService = async (data) => {
    const { razonSocial } = data;

    // Buscamos si existe ignorando mayúsculas/minúsculas
    const existe = await ObraSocial.findOne({ 
        razonSocial: { $regex: new RegExp(`^${razonSocial}$`, 'i') } 
    });

    if (existe) {
        const error = new Error("Esta Obra Social ya se encuentra registrada");
        error.statusCode = 400; // Esto hace que el controlador responda 400 Bad Request
        throw error;
    }

    const newObraSocial = new ObraSocial(data);
    return await newObraSocial.save();
};

export const getObrasSocialesService = async () => {
   return await ObraSocial.find().populate('nomenclador.prestacion');
    // return await ObraSocial.find().populate('prestacionesHabilitadas');
};

// NUEVO: Para agregar o actualizar un código específico en el nomenclador
export const actualizarCodigoNomencladorService = async (osId, itemNomenclador) => {
    // itemNomenclador = { prestacion: id, codigoPropio: "XX", valorConvenio: 100 }
    return await ObraSocial.findByIdAndUpdate(
        osId,
        { $addToSet: { nomenclador: itemNomenclador } }, // Evita duplicados
        { new: true }
    ).populate('nomenclador.prestacion');
};

// NUEVO: Borrado físico (pedido anteriormente)
export const deleteObraSocialService = async (id) => {
    return await ObraSocial.findByIdAndDelete(id);
};

export const cambiarEstadoOSService = async (id, estado) => {
    return await ObraSocial.findByIdAndUpdate(id, { activo: estado }, { new: true, runValidators: true });
};

export const actualizarObraSocialService = async (id, data) => {
    return await ObraSocial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};