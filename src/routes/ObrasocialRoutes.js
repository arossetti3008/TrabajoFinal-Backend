import express from 'express';
import { registrarObraSocial, obtenerObrasSociales,actualizarObraSocial, cambiarEstadoOS } from '../controllers/ObrasocialController.js';

const router = express.Router();

router.post("/", registrarObraSocial);
router.get("/", obtenerObrasSociales);
router.patch("/:id/nomenclador", actualizarObraSocial);
router.put("/:id", actualizarObraSocial); // Esta es la que usa el botón Guardar
router.patch("/:id/estado", cambiarEstadoOS); // Esta es la de Activar/Desactivar

export default router;