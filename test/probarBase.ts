import { db } from '../src/basedatos/conexionBase';

async function baseExiste(): Promise<boolean>{
// promise respuesta de operacion q no termina pero que entrega un resultado
// basicamente devuelve una promesa, q cuando se resuelva entrega booleano
  const resultado = await db.query(`
    SELECT COUNT(*) AS total
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('usuarios','ejemplo')`
  );

  return Number(resultado.rows[0].total) === 2;
}

baseExiste().then(resultado => {
  // then sirve para decirle al promise que hacer cuando se cumpla
  console.log(resultado);
}).catch(error => {
  console.error('Error en postgre', error);
});

// debe devolver true:
// sistema-guardias>npx tsx test/probarBase.ts
