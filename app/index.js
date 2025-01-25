import express from "express";
import { pool } from "../src/db.js";
import { PORT } from "../src/config.js";
import cors from "cors";

const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Endpoint de healthcheck para Railway
app.get("/health", async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const [result] = await pool.query("SELECT 1");

    res.status(200).json({
      status: "OK",
      message: "API funcionando correctamente",
      database: {
        status: "Connected",
        message: "Base de datos conectada y funcionando",
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime() + " segundos",
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "Error",
      message: "Problemas con el servicio",
      database: {
        status: "Disconnected",
        message: "Error de conexión con la base de datos",
        error: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// Enviamos un msg a la ruta default cuando arranque el servidor
app.get("/", async (req, res) => {
  //   res.send("Welcome to server");
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Cuando busquen esta ruta; se hara una consulta a la base de datos y se devolverá una respuesta al cliente
app.get("/ping", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT "hello word" as RESULT');
    // se ve por consola
    console.log(result[0]);
    // res.send("Welcome to SQL server");
    // se envía la respuesta al navegador como un JSON
    res.json(result[0]);
  } catch (error) {
    console.error("Error in ping:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

// Creamos un backend
app.get("/create", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO users(name) VALUES('Mike Tyson')"
    );
    res.json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Eliminamos un usuario por su ID
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        message: `No existe un usuario con el ID ${id}`,
      });
    }

    // Eliminar el usuario
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({
      message: "Usuario eliminado correctamente",
      info: `Se eliminó el usuario con ID ${id}`,
      result,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Error al eliminar usuario",
      message: error.message,
    });
  }
});

// app.listen(PORT);
// console.log("Server running on port", PORT);

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});
