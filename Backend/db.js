import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'verificaciones'
});

db.connect(err => {
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
});

export default db;
