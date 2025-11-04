import express from "express";
import db from "../db.js";

const router = express.Router()

router.post("/Login", (req, res) => {
    const { Correo, password } = req.body;

    if (!Correo || !password) return res.status(400).json({ error: "Faltan campos" });

    const sqlBusqueda = `
    SELECT IdInformador, rol, NombreInformador FROM informador 
    WHERE Correo = ? AND password = ?
    `;

    db.query(sqlBusqueda, [Correo,password], (err, resultado) => {
        if (err) return res.status(500).json({error: "Error al buscar"});

        if (resultado.length == 0) return res.status(401).json({error: "Credenciales inválida"});

        const user = resultado[0]

        res.json({
            mensaje: "OK",
            id: user.IdInformador, 
            Rol: user.rol, 
            Name: user.NombreInformador
        });
    });
});


export default router;
