const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Manejador de errores de validación nativos de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Datos incompletos o inválidos. ${errors.join('. ')}`;
    return res.status(400).json({ success: false, message });
  }

  // Manejador de error de duplicidad en DB
  if (err.code === 11000) {
    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Campo';
    const message =  `Información ya registrada. Por favor, verificar.` //`El valor ${value} ya existe. Use otro.`;
    return res.status(400).json({ success: false, message });
  }

  // CastError (ID de mongo defectuoso)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Referencia inválida en el campo: ${err.path}` });
  }

  // Errores operacionales (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Errores graves del sistema
  console.error("💥 ERROR TÉCNICO INTERNO:", err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error inesperado. Por favor, intentá de nuevo o contactá al administrador.'
  });
};

export default errorHandler;
