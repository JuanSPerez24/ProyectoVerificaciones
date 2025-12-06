import express from "express";
import db from "../db.js";

const router = express.Router();

//Búsqueda de solicitudes por estado y texto
router.get("/Busqueda", (req, res) => {
    const { estado, texto } = req.query;

    if (!estado) {
        return res.status(400).json({ error: "Falta el parámetro 'estado' para realizar la búsqueda." });
    }

    const estadoNum = parseInt(estado, 10);
    let sql = `
        SELECT 
            s.FechaPrimeraEtapa,
            s.Ficha,
            pt.NombrePuntoAtencion,
            s.DescripcionPrimerEtapa,
            s.FechaSegundaEtapa,
            s.DescripcionSegundaEtapa,
            s.FechaTerceraEtapa,
            s.DocumentosEnPunto,
            tr.NombreTramite,
            s.IdRespuesta
        FROM solicitudes s
        INNER JOIN puntoatencion pt ON pt.IdPuntoAtencion = s.PuntoAtencionId
        LEFT JOIN tramiterealizado tr ON tr.IdTramite = s.TramiteId
        WHERE (
            (? = 1 AND s.FechaSegundaEtapa IS NULL AND s.FechaTerceraEtapa IS NULL)
            OR (? = 2 AND s.FechaSegundaEtapa IS NOT NULL AND s.FechaTerceraEtapa IS NULL)
            OR (? = 3 AND s.FechaTerceraEtapa IS NOT NULL)
        )
    `;

    const params = [estadoNum, estadoNum, estadoNum];

    if (texto?.trim()) {
        sql += `
            AND (
                s.Ficha LIKE ? OR
                pt.NombrePuntoAtencion LIKE ? OR
                s.DescripcionPrimerEtapa LIKE ? OR
                s.DescripcionSegundaEtapa LIKE ? OR
                s.DescripcionTerceraEtapa LIKE ? OR
                tr.NombreTramite LIKE ? OR
                s.IdRespuesta LIKE ?
            )
        `;
        const like = `%${texto}%`;
        params.push(like, like, like, like, like, like, like);
    }

    db.query(sql, params, (err, rows) => {
        if (err) {
            console.error("Error al realizar la búsqueda:", err);
            return res.status(500).json({ error: "Error al ejecutar la búsqueda", detalle: err.message });
        }

        res.json({ cantidad: rows.length, datos: rows });
    });
});

export default router;