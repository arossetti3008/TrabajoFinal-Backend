import express from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import { verificarToken, esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Middleware de seguridad en cascada (Solo administradores)
router.use(verificarToken, esAdmin);

// Obtener Lista de Usuarios (Excluyendo contraseñas por seguridad)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo de usuarios.", error: error.message });
    }
});

// Crear Nuevo Usuario Empleado
router.post('/', async (req, res) => {
    try {
        const { username, password, permisos } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Usuario y contraseña son requeridos." });
        }

        const existente = await Usuario.findOne({ username: username.toLowerCase() });
        if (existente) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        const nuevoUser = await Usuario.create({
            username,
            password: secPassword,
            rol: 'user', // Siempre será usuario estándar creado por esta vía
            permisos
        });

        res.status(201).json({ message: "Cargado exitosamente", _id: nuevoUser._id });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el personal.", error: error.message });
    }
});

// Modificar Permisos (o reset de password si se envía)
router.put('/:id', async (req, res) => {
    try {
        const { username, password, permisos } = req.body;
        const updateData = {};

        if (username) updateData.username = username.toLowerCase();
        if (permisos) updateData.permisos = permisos;
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const userActualizado = await Usuario.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!userActualizado) return res.status(404).json({ message: "Usuario no encontrado." });

        res.json({ message: "Modificado exitosamente.", usuario: userActualizado });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar al usuario.", error: error.message });
    }
});

// Dar de baja una credencial
router.delete('/:id', async (req, res) => {
    try {
       // Prevención para no borrar al propio admin activo (suicidal check)
       if(String(req.params.id) === String(req.userId)){
           return res.status(403).json({ message: "Operación Restringida: No puedes auto-eliminarte."});
       }

       const fuser = await Usuario.findByIdAndDelete(req.params.id);
       if (!fuser) return res.status(404).json({ message: "No encontrado" });
       
       res.json({ success: true, message: "Pase denegado/Eliminado permanentemente." });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar", error: error.message });
    }
});

export default router;
