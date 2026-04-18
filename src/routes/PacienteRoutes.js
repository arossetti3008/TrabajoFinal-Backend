import express from 'express';
// *** CORRECCIÓN ANTIGRAVITY ***
// import { registrarPaciente, obtenerPacientes,actualizarPaciente,cambiarEstado } from '../controllers/PacienteController.js';
import { registrarPaciente, obtenerPacientes,actualizarPaciente,cambiarEstado,obtenerPacientePorId } from '../controllers/PacienteController.js';

const router = express.Router();

router.post("/", registrarPaciente);
router.get("/", obtenerPacientes);
// *** CORRECCIÓN ANTIGRAVITY ***
router.get("/:id", obtenerPacientePorId);
router.put("/:id", actualizarPaciente); // Para edición de datos
router.patch("/:id/estado", cambiarEstado); // Para activar/inactivar

export default router;