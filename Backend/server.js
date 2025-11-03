import express from "express";
import cors from "cors";
import db from "./db.js";
import Login  from "./routes/Login.js";
import Solicitud  from "./routes/Solicitud.js";
import DetalladoSolictud  from "./routes/DetalladoSolictud.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", Login);
app.use("/api", Solicitud);
app.use("/api", DetalladoSolictud);

//Dar el link del localhost
app.listen(3000, () => {
    console.log("El servidor esta corriendo en el servidor http://localhost:3000");
});
