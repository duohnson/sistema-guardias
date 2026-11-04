// recibe y devuelve peticiones http,
// controlador.ts: recibe los datos y decide q respuesta HTTP devuelve

import type { RequestHandler } from 'express';
import { crearUsuario } from './servicios';
import { verificarUsuario } from './servicios';
import { crearTokenSesion } from '../../middlewares/verificarSesiones';

export const registrarUsuario: RequestHandler = async (req, res) => {
  const nombre = req.body.nombre;
  const apellido_1 = req.body.apellido_1;
  const apellido_2 = req.body.apellido_2;
  const email = req.body.email;
  const contrasena = req.body.contrasena;

  const datosRegistro = {
    nombre,
    apellido_1,
    apellido_2,
    email,
    contrasena
  };

  const usuarioCreado = await crearUsuario(datosRegistro);


  res.status(201).json({
    estado: '[201] Registro exitoso.',
    mensaje: 'Se procedio a realizar el registro',
    usuario: usuarioCreado
  });


};

export const iniciarSesion: RequestHandler = async (req, res) => {
  const email = req.body.email;
  const contrasena = req.body.contrasena;

  const datosLogeo = {
    email,
    contrasena,
  };

  const usuarioVerificado = await verificarUsuario(datosLogeo);

  if (usuarioVerificado === null) {
    res.status(401).json({
      estado: '[401] Error',
      mensaje: 'Correo electrónico o contraseña son invalidos, verificar.'
    });
  } else res.status(200).json({
    estado: '[200] Logeo exitoso.',
    mensaje: 'Inicio sesión correctamente con sus credenciales.',
    token: crearTokenSesion(usuarioVerificado),
    tipoToken: 'Bearer',
    expiraEnSegundos: 60 * 60 * 8
  })

};
