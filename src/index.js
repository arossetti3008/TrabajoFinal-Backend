import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Importación de Rutas
import pacienteRoutes from './routes/PacienteRoutes.js';
import obrasocialRoutes from './routes/ObrasocialRoutes.js';
import prestacionRoutes from './routes/PrestacionRoutes.js';
import agendaRoutes from './routes/AgendaRoutes.js';
import historialRoutes from './routes/HistorialRoutes.js';

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a DB
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Base de datos conectada correctamente');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};
conectarDB();

import errorHandler from './middlewares/errorHandler.js';

// --- DEFINICIÓN DE ENDPOINTS ---
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/obras-sociales', obrasocialRoutes);
app.use('/api/prestaciones', prestacionRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/historial', historialRoutes);

// --- CONTROLADOR GLOBAL DE ERRORES ---
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://127.0.0.1:${PORT}`);
});