import dotenv from "dotenv";

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

// verificamos que las variables de entorno se entá cargando correctamente
console.log("config.js-> DB_USER:", process.env.DB_USER);
console.log("config.js-> DB_PASSWORD:", process.env.DB_PASSWORD);

// verificamos que nuestro proveedor en la nube nos este dando variables de entorno
export const PORT = process.env.PORT || 4000;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_NAME = process.env.DB_NAME || "db_fazt_railway";
export const DB_PORT = process.env.DB_PORT || 3306;
