import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_super_segura_trinidad';

// Función para inicializar Admin automático en caso de DB vacía
const inicializarAdmin = async () => {
    try {
        const count = await Usuario.countDocuments();
        if (count === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Usuario.create({
                username: 'admin',
                password: hashedPassword,
                rol: 'admin'
            });
            console.log("✔️ Usuario admin por defecto creado con éxito (User: admin / Pass: admin123)");
        }
    } catch (error) {
        console.error("Error inicializando el administrador:", error);
    }
};
inicializarAdmin();

// [POST] /auth/login - Autenticación Pública
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña.' });
        }

        console.log(`🔐 Intentando login para usuario: ${username}`);
        const usuario = await Usuario.findOne({ username: username.toLowerCase() });
        if (!usuario) {
            console.log(`❌ Usuario no encontrado: ${username}`);
            return res.status(404).json({ message: 'El usuario ingresado no existe.' });
        }

        console.log(`🔑 Validando contraseña para: ${username}`);
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            console.log(`❌ Contraseña incorrecta para: ${username}`);
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }
        console.log(`✅ Login exitoso para: ${username}`);

        // Generar Token JWT (Expira en 24h)
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: 86400 } // 24 hours
        );

        res.status(200).json({
            token,
            user: {
                id: usuario._id,
                username: usuario.username,
                rol: usuario.rol,
                permisos: usuario.permisos
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// [GET] /auth/me - Ruta para Validar Sesiones Activas en el Frontend
router.get('/me', verificarToken, (req, res) => {
    // Si llega a esta línea, verificarToken validó el JWT con éxito
    res.status(200).json({
        id: req.usuario._id,
        username: req.usuario.username,
        rol: req.usuario.rol,
        permisos: req.usuario.permisos
    });
});

export default router;
