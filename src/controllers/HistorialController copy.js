import Historial from '../models/Historial.js';
// import Turno from '../models/Turno.js'; // Asumiendo que existe el modelo Turno
import ObraSocial from '../models/ObraSocial.js';

export const registrarEvolucion = async (req, res) => {
  try {
    const { pacienteId, turnoId, prestacionId, observaciones, fechaRealizacion } = req.body;

    // 1. Buscar el turno para obtener la OS del paciente en ese momento
    const turno = await Turno.findById(turnoId).populate('pacienteId');
    const obraSocialId = turno.pacienteId.obraSocial;

    // 2. Buscar el código específico en el nomenclador de esa OS
    let codigo = 'PARTICULAR';
    if (obraSocialId) {
        const os = await ObraSocial.findById(obraSocialId);
        const itemNomenclador = os.nomenclador.find(n => 
            n.prestacion.toString() === prestacionId.toString()
        );
        codigo = itemNomenclador ? itemNomenclador.codigoPropio : 'NO_NOMENCLADO';
    }

    // 3. Crear el registro de historial
    const nuevaEvolucion = new Historial({
      paciente: pacienteId,
      prestacion: prestacionId,
      obraSocial: obraSocialId,
      turno: turnoId,
      codigoAplicado: codigo,
      observaciones,
      fechaRealizacion
    });

    await nuevaEvolucion.save();

    // 4. Marcar el turno como FINALIZADO para que no aparezca en pendientes
    await Turno.findByIdAndUpdate(turnoId, { estado: 'Finalizado' });

    res.status(201).json({ success: true, data: nuevaEvolucion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerHistorialPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const lista = await Historial.find({ paciente: id })
      .populate('prestacion')
      .sort({ fechaRealizacion: -1 });

    // Si 'lista' es un array vacío [], res.json lo envía correctamente
    // El Front lo recibe, ve que tiene longitud 0 y muestra "No hay registros"
    res.status(200).json(lista || []); 
  } catch (error) {
    // Solo enviamos error si hubo un fallo real de base de datos
    res.status(500).json({ message: "Error al consultar la base de datos" });
  }
};