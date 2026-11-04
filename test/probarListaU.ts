import { db } from '../src/basedatos/conexionBase';

async function consultarUsuarios() {

  try {

    const resultado = await db.query('SELECT * FROM usuarios LIMIT 5');
    console.log("[200]");
    console.table(resultado.rows);

  } catch (error) {
    console.error('Error: ', error);

  } finally {
      await db.end();
  }

}

consultarUsuarios();
