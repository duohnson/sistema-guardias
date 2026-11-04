### Flujo

Login / Register solo desde panel Admin.

1. Enviar POST http://.../api/auth/registro con un json que incluya nombre, apellido_1, apellido_2 opcional, email y contrasena.

2. En src/index.ts, express aplica helmet y lee el cuerpo json. Luego dirige las peticiones que empiezan con /api/auth al router de autenticaciones.

3. En rutas.ts, la ruta /registro aplica dos middlewares, en este orden:
   - limitarRegistros: limita la cantidad de solicitudes.
   - validarRegistro: comprueba y normaliza los datos con Zod; por ejemplo, recorta el correo y lo pasa a minúscs.

4. Si la validación pasa, registrarUsuario en controlador.ts toma los datos y llama a crearUsuario en servicios.ts.

5. crearUsuario genera un hash de la contraseña con Argon2, crea un ID y envía un INSERT parametrizado a PostgreSQL a través de db.query.

6. conexionBase.ts configura el Pool de PostgreSQL con las variables PGHOST, PGPORT, PGUSER, PGPASS y PGDB del entorno. La base inserta la fila en usuarios y devuelve el ID y el correo.

7. El controlador responde 201 con esos datos. Si PostgreSQL informa que el correo ya existe, manejarErrores.ts intenta responder 409; otros errores terminan en 500.

El login casi el mismo al principio:

1. Envía POST http://.../api/auth/sesion con email y contrasena.

2. La ruta aplica limitarLogins y después validarLogeo.

3. iniciarSesion llama a verificarUsuario.

4. verificarUsuario busca el usuario en PostgreSQL por correo. Si lo encuentra, compara la contraseña enviada con el hash guardado usando Argon2.

5. Si el usuario no existe o la contraseña no coincide, el controlador responde 401. Si coincide, responde 200
