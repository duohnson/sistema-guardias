import type { ErrorRequestHandler } from 'express';

// ver errores backend
const manejarErrores: ErrorRequestHandler = (error, req, res, next) => {

    // mostrar el error en console
    console.error('[Error proviene de manejarErrores.ts]:', error);

    // comprob si el server envia una respuesta
    if (res.headersSent) {
        return next(error);
    }

    if (
      // typeof comprueba el tipo de valor, si error es igual a objeto y error NO es igual a null
      // y code en error es igual al error de codigo 23505, imprime..

      // se debe comprobar q error sea un objeto, que error no sea null, que exista la propiedad code,
      // y que sea exactamente 23505

        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
    ) {
        console.log('PostgreSQL detectó un valor duplicado');
        if (
        // si existe propiedad constraint dentro del error
          'constraint' in error &&
        // y ese constraint error es igual al UNIQUE

          error.constraint === 'usuarios_email_unique_ci'
  ) {
    // imprime
          res.status(409).json({
            estado: 'ERROR',
            mensaje: 'El correo electrónico ya existe.',
          });
          return;
  }
}

    // enviar un error HTTP 500
    res.status(500).json({
        estado: 'ERROR',
        mensaje: 'Error interno, ver console o comunicar a un admin'
    });

};

export default manejarErrores;
