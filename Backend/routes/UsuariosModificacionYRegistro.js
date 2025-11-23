import express from "express";
import db from "../db.js";

const router = express.Router();

//Crear un nuevo usuario
router.post("/Usuario/Nuevo", (req, res) => {
    const { NombreInformador,Correo,password,IdTipoDocumento,NumeroDocumento,IdRol } = req.body;

    if (!NombreInformador || !Correo || !password || !IdTipoDocumento || !NumeroDocumento || !IdRol) {
        return res.status(400).json({ error: "Faltan campos requeridos" })
    }


    const sqlDatosinformador =`
    INSERT INTO informador 
        (NombreInformador, Correo, password, TipoDocumentoId, NumeroDocumento, RolId) 
    VALUES 
        (? ,? , ?, ?, ?, ?)
    `;
    db.query(sqlDatosinformador,[NombreInformador,Correo,password,IdTipoDocumento,NumeroDocumento,IdRol],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: "Error en la inserción de datos del informador" });

            res.json({mensaje: "Usuario creado con éxito."});
        }
    );
});

//Modificar un usuario
router.put("/Usuario/Mod", (req, res) => {
    const {
        NombreInformador, Correo, RolId, TipoDocumentoId, NumeroDocumento, IdInformador, Activo
    } = req.body;
    if (!NombreInformador || !Correo || !RolId || !TipoDocumentoId || !NumeroDocumento || !IdInformador) return res.status(500).json({ error: "Faltan campos obligatorios" });

    const sqlInformador = `
        UPDATE informador
        SET
            NombreInformador = ?,
            Correo = ?,
            RolId = ?,
            TipoDocumentoId = ?,
            NumeroDocumento = ?,
            Activo = ?
        WHERE
            IdInformador = ?;
    `;

    db.query(sqlInformador, [NombreInformador, Correo, RolId, TipoDocumentoId, NumeroDocumento, Activo, IdInformador], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Erro en la actualizacion de datos del informador" });

        if (resultado.affectedRows == 0) return res.status(500).json({ error: "ID usuario no encontrado" });

        res.json({
            mensaje: "Informador actualizdo",
            InformadorActualizado: {
                NombreInformador,
                Correo,
                RolId,
                TipoDocumentoId,
                NumeroDocumento,
                IdInformador,
                Activo
            }
        });
    });
});

router.put("/Usuario/ModPass", (req, res) => {
    const { IdInformador, NuevaContraseña } = req.body;

    if (!NuevaContraseña || !IdInformador) return res.status(500).json({ error: "Faltan campos obligatorios" });

    const sqlInformador = `
        UPDATE  informador 
        SET 
            password = ?
        WHERE 
            IdInformador = ?
    `;

    db.query(sqlInformador, [NuevaContraseña, IdInformador], (err, resultado) =>{
        if (err) return res.status(500).json({error: "Error en al actualizacion de la contraseña."});

        if(resultado.affectedRows == 0) return res.status(500).json({error: "ID usuarios no entrado"});

        res.json({
            mensaje: "Contraseña cambiada con éxito"
        });

    });

});

//Obtener datos de los usuarios
router.get("/Usuarios", (req, res) => {
    const sqlInformador = `
        SELECT IdInformador,NombreInformador, Correo, NombreRol , SiglaTipoDocumento, NumeroDocumento, RolId, TipoDocumentoId, Activo FROM informador i
        INNER JOIN tiposdocumento on IdTipoDocumento = TipoDocumentoId
        INNER JOIN roles r on i.RolId = r.IdRol
        ;
    `;
    db.query(sqlInformador, (err, resultados) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        res.json(resultados);
    })
});


export default router;