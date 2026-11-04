import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

// datos de identidad que el servidor acepta desp de verif la sess
export interface UsuarioAutenticado {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

const DURACION_SESION_SEGUNDOS = 60 * 60 * 8;

function obtenerSecreto(): string {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) {
    throw new Error('Falta configurar SESSION_SECRET, contactar admin.');
  }
  return secreto;
}

function firma(payload: string, secreto: string): string {
  return createHmac('sha256', secreto).update(payload).digest('base64url');
}

// crear un token firmado para entregarlo al usuario desp de iniciar sesion
export function crearTokenSesion(usuario: UsuarioAutenticado): string {
  const payload = Buffer.from(JSON.stringify({
    ...usuario,
    exp: Math.floor(Date.now() / 1000) + DURACION_SESION_SEGUNDOS,
  })).toString('base64url');
  return `${payload}.${firma(payload, obtenerSecreto())}`;
}

// Rechazar solicitudes sin token validado y pone la identidad verif en req.usuario
const verificarSesiones: RequestHandler = (req, res, next) => {
  const autorizacion = req.get('authorization');
  const coincidencia = autorizacion?.match(/^Bearer\s+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i);

  if (!coincidencia) {
    res.status(401).json({ estado: '[401] Error', mensaje: 'Sesión requerida o inválida.' });
    return;
  }

  try {
    const [payload, firmaRecibida] = coincidencia[1].split('.');
    const firmaEsperada = firma(payload, obtenerSecreto());
    const recibida = Buffer.from(firmaRecibida, 'base64url');
    const esperada = Buffer.from(firmaEsperada, 'base64url');

    if (recibida.length !== esperada.length || !timingSafeEqual(recibida, esperada)) {
      res.status(401).json({ estado: '[401] Error', mensaje: 'Sesión requerida o inválida.' });
      return;
    }

    const datos: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      typeof datos !== 'object' || datos === null ||
      !('id' in datos) || typeof datos.id !== 'string' ||
      !('email' in datos) || typeof datos.email !== 'string' ||
      !('exp' in datos) || typeof datos.exp !== 'number' || datos.exp <= Math.floor(Date.now() / 1000)
    ) {
      res.status(401).json({ estado: '[401] Error', mensaje: 'Sesión requerida o inválida.' });
      return;
    }

    req.usuario = { id: datos.id, email: datos.email };
    next();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Falta configurar SESSION_SECRET')) {
      next(error);
      return;
    }
    res.status(401).json({ estado: '[401] Error', mensaje: 'Sesión requerida o inválida.' });
  }
};

export default verificarSesiones;
