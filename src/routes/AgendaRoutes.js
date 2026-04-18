import express from 'express';
import { registrarCita, obtenerAgenda,actualizarAgenda, eliminarAgenda,obtenerAgendaPendientePaciente, finalizarTurno } from '../controllers/AgendaController.js';

const router = express.Router();

router.get("/", obtenerAgenda); // GET /api/agenda
router.post("/", registrarCita); // POST /api/agenda
router.put("/:id",actualizarAgenda);
router.delete("/:id",eliminarAgenda);
router.get('/paciente/:id/pendientes', obtenerAgendaPendientePaciente);
// outer.patch('/:id/finalizar', finalizarTurno);

export default router;