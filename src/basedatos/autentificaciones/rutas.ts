// rutas de peticiones http
import { Router } from 'express';
import { validarRegistro } from '../../middlewares/validarDatos';
import { registrarUsuario } from './controlador';
import { validarLogeo } from '../../middlewares/validarDatos';
import { iniciarSesion } from './controlador';
import { limitarLogins, limitarRegistros } from '../../middlewares/limitarPeticiones';
import verificarSesiones from '../../middlewares/verificarSesiones';

const autentificar = Router();

function autentificarRoute() {

    // get para ver el estado
    autentificar.get('/estado', (req, res) => {
        res.status(200).json({
            mensaje: '[200] en route.ts'
        });
    });

    // post para registrar usuarios
  autentificar.post('/registro', limitarRegistros, validarRegistro, registrarUsuario);
  // limitarLogins en registro es temp, en lo que hago el propio de el

  autentificar.post('/sesion', limitarLogins, validarLogeo, iniciarSesion);

    // ruta de ejemplo protegida: exige el bearer token emitido en /sesion
    autentificar.get('/yo', verificarSesiones, (req, res) => {
      res.status(200).json({ usuario: req.usuario });
    });

    return autentificar;
}

const autentificado: Router = autentificarRoute();

export default autentificado;
