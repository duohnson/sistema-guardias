import { z } from 'zod';
import type { RequestHandler } from 'express';
import { email } from 'zod/mini';

// validar info que se integra al registro
export const esquemaRegistro = z.object({
    nombre: z.string().trim().min(1).max(150),
    apellido_1: z.string().trim().min(1).max(150),
    apellido_2: z.string().trim().max(150).optional(),
    email: z.string().trim().toLowerCase().email().max(255),
    contrasena: z.string().min(12).max(128)
});

export const validarRegistro: RequestHandler = (req, res, next) => {

    const resultado = esquemaRegistro.safeParse(req.body);

    if (!resultado.success) {
        res.status(400).json({
            estado: 'ERROR',
            mensaje: 'Datos de registro inválidos, por favor verificar.'
        });
        return;
    }

    req.body = resultado.data;

    next();
};

// validar info de logeo

export const esquemaLogeo = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  contrasena: z.string().min(12).max(128)
});

export const validarLogeo: RequestHandler = (req, res, next) => {

  const resultado = esquemaLogeo.safeParse(req.body);

  if (!resultado.success) {
    res.status(400).json({
      estado: 'ERROR',
      mensaje: 'Datos de inicio de sesión erroneos, utilice un correo valido y una contraseña mayor a 12 caracteres.'
    });
    return;
  }

  req.body = resultado.data;

  next();

};
