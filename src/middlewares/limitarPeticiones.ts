import { rateLimit } from 'express-rate-limit';

export const limitarLogins = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10, message: {
    estado: '[429] Error',
    mensaje: 'Demasiados intentos de inicio de sesión, intentar más tarde.'
  }
});

export const limitarRegistros = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5, message: {
    estado: '[429] Error',
    mensaje: 'Demasiados intentos de registro, intentar más tarde.'
  }
});
