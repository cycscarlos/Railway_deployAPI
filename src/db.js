// Se utiliza tanto en desarrollo como en producción. Establece la conexión a la base de datos utilizando las variables de entorno definidas en config.js.

import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

export { pool };
