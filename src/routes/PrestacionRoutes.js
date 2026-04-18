import express from 'express';
import { registrarPrestacion, obtenerPrestaciones, actualizarPrestacion, eliminarPrestacion, cambiarEstadoPrestacion } from '../controllers/PrestacionController.js';

const router = express.Router();

router.post("/", registrarPrestacion);
router.get("/", obtenerPrestaciones);
router.put("/:id", actualizarPrestacion); // Para edición de datos
router.patch("/:id/estado", cambiarEstadoPrestacion); // Para activar/inactivar
router.delete("/:id", eliminarPrestacion); // Para eliminar prestación

export default router;