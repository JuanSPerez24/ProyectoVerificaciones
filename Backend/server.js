import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import BusquedaPorTextoYEstado from "./routes/BusquedaPorTextoYEstado.js";
import DetalladoSolictud  from "./routes/DetalladoSolictud.js";
import ListasDesplegables  from "./routes/ListasDesplegables.js";
import Login  from "./routes/Login.js";
import UsuariosModificacionYRegistro from "./routes/UsuariosModificacionYRegistro.js";
import health from "./routes/health.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Servir archivos estáticos del Frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

// Registro global de errores y excepciones para diagnosticar errores 500 en producción
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.get('/Buscar.html', (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/HTML/Buscar.html"));
});

app.get('/RegistroYconsulta.html', (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/HTML/RegistroYconsulta.html"));
});

app.get('/Usuarios.html', (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/HTML/Usuarios.html"));
});

app.use("/api", BusquedaPorTextoYEstado);
app.use("/api", DetalladoSolictud);
app.use("/api", ListasDesplegables);
app.use("/api", Login);
app.use("/api", UsuariosModificacionYRegistro);
app.use("/api", health);

//Dar el link del localhost
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
