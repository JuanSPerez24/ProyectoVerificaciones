import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

// Usar pool de conexiones en lugar de una sola conexión
// Esto maneja automáticamente las reconexiones y timeouts
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'verificaciones',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // Máximo de conexiones inactivas; default es igual a connectionLimit
  idleTimeout: 60000, // Tiempo en ms antes de cerrar una conexión inactiva
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Probar la conexión inicial
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error en la conexión con MySQL:", err);
    console.error("Usando variables:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    return;
  }
  console.log("Conexión exitosa con MySQL");
  connection.release(); // Liberar la conexión de vuelta al pool
});

export default db;
