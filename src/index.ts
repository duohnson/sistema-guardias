import express from 'express';
import helmet from 'helmet'; // encabezados http seguridad
import autentificado from './basedatos/autentificaciones/rutas';
import manejarErrores from './middlewares/manejarErrores';
import * as fs from 'fs';

const app = express();

app.set('trust proxy', 'loopback');

app.disable('x-powered-by'); // deshab encabezado q identifica a express en respuestas http, esto realmente, da casi igual, en el mismo github digo que tecnologia utilice,
// unicamente sirve para desactivar el: "X-Powered-By: Express" que devuelve una una peticion curl -I

app.use(helmet());
app.use(express.json({ limit: '16kb' }));
// establece un limite de kgs para la peticion json enviada

app.use('/api/auth', autentificado); //

app.get('/', (req, res) => {
  const tiempo = new Date().toISOString();
  // new date genera una fecha legigle gracias a toISOString
  const guardarLog = `[${tiempo}]IP ingresa: `;
  console.log(guardarLog + req.ip);
  // se guarda la ruta en una const
  const carpetaLog = ('./logs')
  const lugarLog = ('./logs/logs.txt');
  // si NO existe lugarLog, crear, recursive permite crear el path si no existe
  if (!fs.existsSync(carpetaLog)) {
    fs.mkdirSync(carpetaLog, { recursive: true });
  };
  fs.appendFileSync(lugarLog, guardarLog + req.ip + '\n');
  res.send('Servicio en [200]');
});
// recordar luego remover sync por lentitud y reemplazar por promises

app.use(manejarErrores);

app.listen(3007, '127.0.0.1', () => {
    console.log('[200] - http://localhost:3007');
});
// cerrar siemp y usar solo local por el cloudflared
