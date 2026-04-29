import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_super_segura_trinidad';

export const verificarToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
      return res.status(403).json({ message: 'No se ha provisto un token de autenticación.' });
    }

    const token = bearerHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Formato de token inválido.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;

    // Obtener el usuario activo para incluir sus privilegios
    const usuario = await Usuario.findById(req.userId);
    if (!usuario) {
      return res.status(404).json({ message: 'El usuario del token ya no existe.' });
    }

    req.usuario = usuario; // Guardamos registro del objeto
    next();
  } catch (error) {
    return res.status(401).json({ message: 'No Autorizado: Token inválido o expirado.', error: error.message });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Requiere nivel de privilegios Admin para esta acción.' });
  }
};
