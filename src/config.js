// Se utiliza tanto en desarrollo como en producción. Carga las variables de entorno desde .env en desarrollo o desde el proveedor de la nube, en un entorno de producción.

import dotenv from "dotenv";
// Cargar .env solo en desarrollo, no en producción
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Ambiente de desarrollo. Verificación que las variables de entorno se estan cargando desde el archivo .env
console.log("variable proveniente de .env | DB_HOST:", process.env.DB_HOST);
console.log("variable proveniente de .env | DB_NAME:", process.env.DB_NAME);
console.log("variable proveniente de .env | DB_USER:", process.env.DB_USER);
console.log(
  "variable proveniente de .env | DB_PASSWORD:",
  process.env.DB_PASSWORD
);
console.log("variable proveniente de .env | DB_PORT:", process.env.DB_PORT);

// Sí el archivo .env o el proveedor de la nube NO proveé el puerto, entonces utiliza el 4000 por Default
 
export const PORT = process.env.PORT || 4000;

// Utiliza las variables de entorno del archivo .env o del proveedor de la nube para establecer la conexión con la Base de Datos
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
