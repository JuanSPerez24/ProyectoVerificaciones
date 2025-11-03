import express from "express";
import cors from "cors";
import db from "./db.js";
import BusquedaPorTextoYEstado from "./routes/BusquedaPorTextoYEstado.js";
import DetalladoSolictud  from "./routes/DetalladoSolictud.js";
import ListasDesplegables  from "./routes/ListasDesplegables.js";
import Login  from "./routes/Login.js";
import UsuariosModificacionYRegistro from "./routes/UsuariosModificacionYRegistro.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", BusquedaPorTextoYEstado);
app.use("/api", DetalladoSolictud);
app.use("/api", ListasDesplegables);
app.use("/api", Login);
app.use("/api", UsuariosModificacionYRegistro);

//Dar el link del localhost
app.listen(3000, () => {
    console.log("El servidor esta corriendo en el servidor http://localhost:3000");
});
