import express from 'express';
import { registrarEvolucion, obtenerHistorialPaciente } from '../controllers/HistorialController.js';

const router = express.Router();

// Esta ruta es la que llama el hook useHistorial
router.get('/paciente/:id', obtenerHistorialPaciente);
router.post('/', registrarEvolucion);

export default router;