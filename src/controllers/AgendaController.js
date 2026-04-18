import { crearCitaService, getAgendaService, actualizarCitaService, eliminarCitaService } from "../services/AgendaService.js";
import Agenda from "../models/Agenda.js";
import Historial from "../models/Historial.js";
import catchAsync from "../middlewares/catchAsync.js";

export const registrarCita = catchAsync(async (req, res) => {
    const guardado = await crearCitaService(req.body);
    res.status(201).json(guardado);
});

export const obtenerAgenda = catchAsync(async (req, res) => {
    const citas = await getAgendaService();
    res.status(200).json(citas);
});

export const actualizarAgenda = catchAsync(async (req, res) => {
    const { id } = req.params;
    const citaActualizada = await actualizarCitaService(id, req.body);
    res.status(200).json(citaActualizada);
});

export const eliminarAgenda = catchAsync(async (req, res) => {
    const { id } = req.params;
    await eliminarCitaService(id);
    res.status(200).json({ message: "Se eliminó el turno" });
});

export const obtenerAgendaPendientePaciente = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // Obtenemos los turnos del paciente que están como FINALIZADOS
    const turnosFinalizados = await Agenda.find({ 
        paciente: id, 
        estado: 'FINALIZADO' 
    }).populate('prestacion'); 

    // Obtenemos todos los historiales de este paciente filtrando sólo su ID de turno
    const historiales = await Historial.find({ paciente: id }).select('turno');
    const turnosConHistorial = historiales.map(h => h.turno?.toString());

    // Filtramos para retornar sólo aquellos que NO tengan una evolución cargada en Historial
    const turnos = turnosFinalizados.filter(t => !turnosConHistorial.includes(t._id.toString()));

    res.status(200).json(turnos || []);
});

export const finalizarTurno = catchAsync(async (req, res) => {
    const { id } = req.params;
    const turnoActualizado = await Agenda.findByIdAndUpdate(
        id, 
        { estado: 'FINALIZADO' }, 
        { new: true, runValidators: true }
    );
    res.status(200).json(turnoActualizado);
});