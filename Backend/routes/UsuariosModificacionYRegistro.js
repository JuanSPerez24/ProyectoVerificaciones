import express from "express";
import db from "../db.js";
import { resourceUsage } from "process";

const router = express.Router();

//Crear un nuevo usuario
router.post("/informador", (req, res) => {
    const { NombreInformador, Correo, password, Rol, TipoDocumentoId, NumeroDocumento } = req.body;

    if (!NombreInformador || !Correo || !password || !Rol || !TipoDocumentoId || !NumeroDocumento) {
        return res.status(400).json({ error: "Faltan campos requeridos" })
    }
    db.query("INSERT INTO informador (NombreInformador, Correo, password, Rol, TipoDocumentoId, NumeroDocumento) VALUES (? ,? , ?, ?, ?, ?)",
        [NombreInformador, Correo, password, Rol, TipoDocumentoId, NumeroDocumento],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: "Error en la inserción de datos del informador" });

            res.json({ id: resultado.insertId, NombreInformador, Correo, Rol, TipoDocumentoId, NumeroDocumento })
        }
    );
});

//Modificar un usuario
router.put("/ModInformador", (req, res) => {
    const {
        IdInformador,
        Correo, password
    } = req.body;

    if (!IdInformador || !Correo || !password) return res.status(500).json({ error: "Faltan campos obligatorios" });

    const sqlInformador = `
        UPDATE informador
        SET Correo = ?, password = ?
        WHERE IdInformador = ?
    `;

    db.query(sqlInformador, [Correo, password, IdInformador], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Erro en la actualizacion de datos del informador" });

        if (resultado.affectedRows == 0) return res.status(500).json({ error: "ID usuario no encontrado" });

        res.json({
            mensaje: "Informador actualizdo",
            InformadorActualizado: {
                IdInformador,
                Correo,
                password
            }

        })
    });
});

//Obtener datos de los usuarios
router.get("/verificaciones/informador", (req, res) => {
    db.query("SELECT * FROM informador;", (err, resultados) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        res.json(resultados);
    })
});


export default router;