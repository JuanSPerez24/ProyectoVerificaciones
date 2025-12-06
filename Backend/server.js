import express from "express";
import cors from "cors";
import db from "./db.js";
import BusquedaPorTextoYEstado from "./routes/BusquedaPorTextoYEstado.js";
import DetalladoSolictud  from "./routes/DetalladoSolictud.js";
import ListasDesplegables  from "./routes/ListasDesplegables.js";
import Login  from "./routes/Login.js";
import UsuariosModificacionYRegistro from "./routes/UsuariosModificacionYRegistro.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Proyecto Verificaciones', estado: 'online' });
});

app.use(express.json());
app.use(cors());

app.use("/api", BusquedaPorTextoYEstado);
app.use("/api", DetalladoSolictud);
app.use("/api", ListasDesplegables);
app.use("/api", Login);
app.use("/api", UsuariosModificacionYRegistro);

//Dar el link del localhost
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
