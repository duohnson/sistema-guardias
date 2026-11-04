import { db } from './conexionBase';

async function baseExiste(): Promise<boolean>{
  const resultado = await db.query(`
    SELECT COUNT(*) AS total
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'usuarios',
    )
  `);

  return Number(resultado.rows[0].total) === 1;
}

async function creamosDB(): Promise<void> {
    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id UUID PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            apellido_1 VARCHAR(100) NOT NULL,
            apellido_2 VARCHAR(100),
            email VARCHAR(320) NOT NULL UNIQUE,
            contrasena_hash TEXT NOT NULL,
            rol VARCHAR(30) NOT NULL DEFAULT 'usuario'
        );
    `);

    console.log('Estructura de base de datos creada correctamente.');
}

baseExiste().then(resultado => {
  if (resultado === false) {
    console.log('Faltan tablas, creando...');
    return creamosDB();
  } else {
    console.log('Todas las tablas estan correctas.');
  }
});
