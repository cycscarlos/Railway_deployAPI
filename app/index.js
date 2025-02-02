import express from "express";
import { pool } from "../src/db.js";
import { PORT } from "../src/config.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json());

// Morgan
app.use(morgan("tiny"));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '../public'))); // Ahora __dirname está definido

// EJS
app.set("view engine", "ejs");
app.set("views", "./src/views"); 

// Formatos JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint de healthcheck para Railway
app.get("/health", async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const [result] = await pool.query("SELECT 1");

    const healthCheckResponse = {
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
    };

    // Enviar la respuesta formateada como JSON
    res.setHeader("Content-Type", "application/json"); // Asegúrate de que el tipo de contenido sea JSON
    res.send(JSON.stringify(healthCheckResponse, null, 2)); // 2 espacios de indentación
  } catch (error) {
    const errorResponse = {
      status: "Error",
      message: "Problemas con el servicio",
      database: {
        status: "Disconnected",
        message: "Error de conexión con la base de datos",
        error: error.message,
      },
      timestamp: new Date().toISOString(),
    };

    // Enviar la respuesta de error formateada como JSON
    res.setHeader("Content-Type", "application/json"); // Asegúrate de que el tipo de contenido sea JSON
    res.send(JSON.stringify(errorResponse, null, 2)); // 2 espacios de indentación
  }
});

// Enviamos un msg a la ruta default cuando arranque el servidor
// app.get("/", async (req, res) => {
//   //   res.send("Welcome to server");
//   try {
//     const [rows] = await pool.query("SELECT * FROM users");
//     // Convertir el arreglo a un string JSON formateado
//     const formattedJson = JSON.stringify(rows, null, 2); // 2 espacios de indentación
//     res.setHeader("Content-Type", "application/json"); // Asegúrate de que el tipo de contenido sea JSON
//     res.send(formattedJson); // Enviar el JSON formateado
//     // res.json(rows);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Error al obtener usuarios" });
//   }
// });

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.render("users", { users: rows }); // Renderiza la vista con los datos
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Cuando busquen esta ruta; se hara una consulta a la base de datos y se devolverá una respuesta al cliente
app.get("/ping", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT "hello world" as RESULT');
    res.setHeader("Content-Type", "application/json"); // Asegúrate de que el tipo de contenido sea JSON
    res.send(JSON.stringify(result[0], null, 2)); // 2 espacios de indentación
  } catch (error) {
    console.error("Error in ping:", error);
    res
      .status(500)
      .send(
        JSON.stringify(
          { error: "Error al conectar con la base de datos" },
          null,
          2
        )
      ); // 2 espacios de indentación
  }
});

// Creamos un backend
app.get("/create", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO users(name) VALUES('Babe Ruth')"
    );
    res.setHeader("Content-Type", "application/json"); // Asegúrate de que el tipo de contenido sea JSON
    res.send(JSON.stringify(result, null, 2)); // 2 espacios de indentación
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send(JSON.stringify({ error: "Error al crear usuario" }, null, 2)); // 2 espacios de indentación
  }
});

// Eliminamos un usuario por su ID
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).send(
        JSON.stringify(
          {
            error: "Usuario no encontrado",
            message: `No existe un usuario con el ID ${id}`,
          },
          null,
          2
        )
      ); // 2 espacios de indentación
    }

    // Eliminar el usuario
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.send(
      JSON.stringify(
        {
          message: "Usuario eliminado correctamente",
          info: `Se eliminó el usuario con ID ${id}`,
          result,
        },
        null,
        2
      )
    ); // 2 espacios de indentación
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send(
      JSON.stringify(
        {
          error: "Error al eliminar usuario",
          message: error.message,
        },
        null,
        2
      )
    ); // 2 espacios de indentación
  }
});

// app.listen(PORT);
// console.log("Server running on port", PORT);

// console.log(`Intentando iniciar el servidor en el puerto: ${PORT}`);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
