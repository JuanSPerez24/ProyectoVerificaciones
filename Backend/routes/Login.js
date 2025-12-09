import express from "express";
import db from "../db.js";

const router = express.Router()

router.post("/Login", (req, res) => {
    try {
    const { Correo, password } = req.body;

    console.log('Login request body:', req.body);

    if (!Correo || !password) return res.status(400).json({ error: "Faltan campos" });

    const sqlBusqueda = `
    SELECT IdInformador, RolId, NombreInformador, Activo FROM informador 
    WHERE Correo = ? AND password = ?
    `;

    db.query(sqlBusqueda, [Correo,password], (err, resultado) => {
        if (err) {
            console.error("Error en Login query:", err);
            return res.status(500).json({error: "Error al buscar", detalle: err.message});
        }

        if (!resultado || resultado.length == 0) return res.status(401).json({error: "Credenciales inválidas"});

        const user = resultado[0]
        
        if(user.Activo == 0) return res.status(403).json({error: "Credenciales no validas"});

        res.json({
            mensaje: "OK",
            id: user.IdInformador, 
            Rol: user.RolId, 
            Name: user.NombreInformador,
            Activo: user.Activo
        });
    });
    } catch (err) {
      console.error('Error inesperado en /Login:', err);
      res.status(500).json({ error: 'Error inesperado', detalle: err.message });
    }
});


export default router;
