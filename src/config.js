// Se utiliza tanto en desarrollo como en producción. Carga las variables de entorno desde .env en desarrollo y desde el entorno de producción en producción.

import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// verificamos que las variables de entorno se entá cargando correctamente desde el archivo .env
// console.log("config.js-> DB_USER:", process.env.DB_USER);
// console.log("config.js-> DB_PASSWORD:", process.env.DB_PASSWORD);

// verificamos que nuestro proveedor de la nube nos este dando el puerto como una variables de entorno
export const PORT = process.env.PORT || 4000;

// verificamos que nuestro proveedor de la nube nos este dando las variables de entorno requeridas para establecer la conexión con la Base de Datos
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_NAME = process.env.DB_NAME || "db_fazt_railway";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || "root";