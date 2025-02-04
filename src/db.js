// Se utiliza tanto en desarrollo como en producción. Establece la conexión a la base de datos utilizando las variables de entorno definidas en config.js.

import mysql from "mysql2/promise";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from "../src/config.js";

// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

export { pool };
