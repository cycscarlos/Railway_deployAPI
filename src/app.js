import express from "express";
import { pool } from "./db.js";
import { PORT } from "./config.js";

const app = express();

// Enviamos un msg a la ruta default cuando arranque el servidor
app.get("/", async (req, res) => {
  //   res.send("Welcome to server");
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);

  //   const result = await pool.query("SELECT * FROM users");
  //   res.json(result);
});

// Cuando busquen esta ruta; se hara una consulta a la base de datos y se devolverá una respuesta al cliente
app.get("/ping", async (req, res) => {
  const [result] = await pool.query('SELECT "hello word" as RESULT');
  // se ve por consola
  console.log(result[0]);
  // res.send("Welcome to SQL server");
  // se envía la respuesta al navegador como un JSON
  res.json(result[0]);
});

// Creamos un backend
app.get("/create", async (req, res) => {
  const result = await pool.query("INSERT INTO users(name) VALUES('John Doe')");
  res.json(result);
});

app.listen(PORT);
console.log("Server running on port", PORT);
