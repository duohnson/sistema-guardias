import 'dotenv/config';
import { Pool } from 'pg';
// librerias para conectar nodejs a postgreSQL en conjunto al .env

// exportar los datos a constante db

// new pool crea un administrador a postgre y el export, reutiliza a toda la api

export const db = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  database: process.env.PGDB
});
