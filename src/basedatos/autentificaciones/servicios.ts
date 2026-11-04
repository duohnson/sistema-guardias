// gestion log, regs, y acceso a data

import * as argon2 from 'argon2';
import { db } from '../conexionBase';
import { v7 } from 'uuid';
// import { string } from 'zod/v3';

interface DatosRegistro {
  nombre: string;
  apellido_1: string;
  email: string;
  contrasena: string;
  apellido_2?: string;
};

// desestructuracion de objetos, esta permite extraer varias propiedades de un objeto en una sola declaracion
// ejemplo, es lo mismo que:
// const nombre = datosUsuario.nombre;
// const apellido_1 = datosUsuario.apellido_1;

export async function crearUsuario(datosUsuario: DatosRegistro) {

  const { nombre, email, apellido_1, apellido_2, contrasena } = datosUsuario;
  const contrasenaHash = await argon2.hash(contrasena, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  })
  // se crea una const contrasenaHash que espera el hasheo de la contrasena
  // libreria argon se encarga del hasheo

  const id = v7();
  const resultadoConsulta = await db.query(prepararConsulta, [id, nombre, apellido_1, apellido_2, email, contrasenaHash])
  // donde const resultadoConsulta es lo mismo que que la query prepararConsulta
  const usuarioCreado = resultadoConsulta.rows[0];
  // rows[0] porq devuelve la ultima fila de la tabla
  return usuarioCreado;
  // retorna el rows

};

const prepararConsulta = `

  INSERT INTO usuarios (
    id, nombre, apellido_1, apellido_2, email, contrasena_hash, rol
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id, email
  `;

interface DatosLogeo {
  email: string;
  contrasena: string;
};

export async function verificarUsuario(datosLogeo: DatosLogeo) {
  // crear funcion asincrona que, datos logeo sea igual a la interface donde establece q
  // email y contra son string
  //
  const { email, contrasena } = datosLogeo;
  // const donde los parametros email y contra son los que usara datos logeo

  const prepararConsultaLogin = `

    SELECT id, email, contrasena_hash FROM usuarios WHERE lower(email) = $1
    `;

  const resultaConsultaLogin = await db.query(prepararConsultaLogin, [email]);
  // resultaConsultaLogin es lo mismo que la espera a la consulta de la db,
  // donde prepararConsultaLogin consulta el email

  const usuarioEncontrado = resultaConsultaLogin.rows[0];
  if (usuarioEncontrado === undefined) {
    return null;
    // null representa ausencia de resultado, y return termina la funcion y devuelve ese valor
  };

  const contraValida = await argon2.verify(usuarioEncontrado.contrasena_hash, contrasena);

  if (contraValida === false) {
    return null;
  } else {
    return {
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
    }
  }
};
