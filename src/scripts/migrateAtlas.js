import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno (asegúrate de que MONGO_URI apunte a tu Atlas en el .env antes de correr esto)
dotenv.config();

// Modelos
import Paciente from '../models/Paciente.js';
import Usuario from '../models/Usuario.js';

const migrateDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Conectando a la base de datos: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conexión exitosa a MongoDB');

    // 1. Migración de Pacientes: Agregar campo numeroAfiliado si no existe
    console.log('Iniciando migración de Pacientes...');
    const resultPacientes = await Paciente.updateMany(
      { numeroAfiliado: { $exists: false } },
      { $set: { numeroAfiliado: '' } }
    );
    console.log(`✅ Pacientes actualizados: ${resultPacientes.modifiedCount}`);

    // 2. Migración de Usuarios: Crear el usuario Admin por defecto si no existe ninguno
    console.log('Iniciando verificación de Usuarios...');
    const adminExists = await Usuario.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt); // Contraseña por defecto: admin123

      const nuevoAdmin = new Usuario({
        username: 'admin',
        password: hashedPassword,
        rol: 'admin',
        permisos: {
          pacientes: { ver: true, crear: true, editar: true, eliminar: true },
          agenda: { ver: true, crear: true, editar: true, eliminar: true },
          obras: { ver: true, crear: true, editar: true, eliminar: true },
          prestaciones: { ver: true, crear: true, editar: true, eliminar: true }
        }
      });

      await nuevoAdmin.save();
      console.log('✅ Usuario Administrador creado exitosamente (Usuario: admin, Contraseña: admin123)');
    } else {
      console.log('ℹ️ El usuario administrador ya existe. No se creó ninguno nuevo.');
    }

    console.log('🎉 Migración completada con éxito.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
};

migrateDB();
