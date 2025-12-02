import express from "express";
import db from "../db.js";

const router = express.Router()

// Buscar Ficha
router.post("/verificaciones", (req, res) => {
    const { Ficha } = req.body;

    if (!Ficha) return res.status(400).json({ error: "Falta el campo 'Ficha'" });

    const sqlBusqueda = `
        SELECT 
            s.*, 
            dt.*,
            dt2.IdSolicitante AS IdSolicitanteTercera,
            dt2.TipoDocumentoId AS TipoDocumentoIdTercera,
            dt2.NumeroDocumento AS NumeroDocumentoTercera,
            dt2.Correo AS CorreoTercera,
            dt2.Celular AS CelularTercera,
            dt2.Hogar AS HogarTercera,
            dt2.Orden AS OrdenTercera,
            MAX(CASE WHEN t.IdTipologia = 1 THEN t.IdTipologia END) AS id_tp1,
            MAX(CASE WHEN t.IdTipologia = 2 THEN t.IdTipologia END) AS id_tp2,
            MAX(CASE WHEN t.IdTipologia = 3 THEN t.IdTipologia END) AS id_tp3
        FROM solicitudes s
        INNER JOIN datossolicitantes dt 
            ON s.SolicitantePrimeraEtapaId = dt.IdSolicitante
        LEFT JOIN datossolicitantes dt2 
            ON s.SolicitanteTerceraEtapaId = dt2.IdSolicitante
        LEFT JOIN tramitetipologias tt 
            ON s.IdSolicitud = tt.SolicitudId
        LEFT JOIN tipologias t 
            ON tt.TipologiaId = t.IdTipologia
        WHERE s.Ficha = ?
        GROUP BY s.IdSolicitud
        ORDER BY s.FechaPrimeraEtapa DESC
        LIMIT 1;
    `;

    db.query(sqlBusqueda, [Ficha], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la búsqueda" });

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ninguna solicitud con esa ficha" });
        }

        res.json(resultado);
    });
});

//Crear una solicitud (Registrar primera etapa)
router.put("/verificaciones/solicitudes", (req, res) => {

    const { FechaPrimeraEtapa, Ficha, informadorPrimeraEtapaId, PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa,
        TipoDocumentoId, NumeroDocumentoSolicitante, Correo, Celular, Hogar, Orden, Tipologias } = req.body

    if (!FechaPrimeraEtapa || !Ficha || !informadorPrimeraEtapaId || !PuntoAtencionId || !VerificacionId || !DescripcionPrimerEtapa ||
        !TipoDocumentoId || !NumeroDocumentoSolicitante || !Celular || !Hogar || !Orden || !Array.isArray(Tipologias) || Tipologias.length === 0)
        return res.status(400).json({ error: "Faltan campos obligatorios de la solicitud" });

    const CorreoFinal = Correo && Correo.trim() !== "" ? Correo : null;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: "Error al iniciar la transacción" });

        const sqlSolicitante = `
            INSERT INTO datossolicitantes (TipoDocumentoId, NumeroDocumento, Correo, Celular, Hogar, Orden) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE IdSolicitante = LAST_INSERT_ID(IdSolicitante)
        `;

        db.query(sqlSolicitante, [TipoDocumentoId, NumeroDocumentoSolicitante, CorreoFinal, Celular, Hogar, Orden], (err, resSolicitante) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: "Error en la consulta o inserción de datos del solicitante" });
                });
            };

            const SolicitanteId = resSolicitante.insertId;

            const SqlSolicitud = `
                INSERT INTO solicitudes 
                (FechaPrimeraEtapa, Ficha, SolicitantePrimeraEtapaId, InformadorPrimeraEtapaId, PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `;

            db.query(SqlSolicitud, [FechaPrimeraEtapa, Ficha, SolicitanteId, informadorPrimeraEtapaId, PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa], (err, resSolicitud) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: "Error en la inserción de la solicitud", err });
                    });
                };

                const SolicitudId = resSolicitud.insertId

                const IdSol_IdTipo = Tipologias.map(id => [SolicitudId, id]);

                const SqlTipologias = `
                    INSERT INTO tramitetipologias 
                    (SolicitudId, tipologiaId)
                    VALUES ?;
                `;

                db.query(SqlTipologias, [IdSol_IdTipo], (err, resTipologia) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error en la inserción de tipologias" });
                        });
                    };

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error en la confirmación de la transacción" });
                            });
                        };

                        res.json({
                            mensaje: "Solicitud creada con exito",

                            solicitante: {
                                id: SolicitanteId,
                                TipoDocumentoId: TipoDocumentoId,
                                NumeroDocumento: NumeroDocumentoSolicitante,
                                Orden: Orden,
                                Hogar: Hogar
                            },
                            Solicitud: {
                                id: resSolicitud.insertId,
                                FechaPrimeraEtapa: FechaPrimeraEtapa,
                                solicitante: SolicitanteId,
                                informadorPrimeraEtapaId: informadorPrimeraEtapaId,
                                PuntoAtencionId: PuntoAtencionId
                            },
                            Tipologias: Tipologias
                        });
                    });
                });
            });
        });
    });
});

//Registrar segunda etapa
router.put("/verificaciones/SegundaEtapa", (req, res) => {
    const { FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa, IdSolicitud } = req.body;

    if (!FechaSegundaEtapa || !Levantamiento || !DescripcionSegundaEtapa || !IdSolicitud) return res.status(400).json({ error: "Faltan campos obligatorios" });

    const sqlSegundaEtapa = `
        UPDATE solicitudes
        SET FechaSegundaEtapa = ?, Levantamiento = ?, DescripcionSegundaEtapa = ?
        WHERE IdSolicitud = ?;
    `;

    db.query(sqlSegundaEtapa, [FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa, IdSolicitud], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en al actualizacion de datos" });

        if (resultado.affectedRows == 0) return res.status(404).json({ error: "Ficha no encontrada" });

        res.json({
            mensaje: "Segunda etapa actualizada correctamente",
            solicitudActualizada: {
                IdSolicitud,
                FechaSegundaEtapa,
                Levantamiento,
                DescripcionSegundaEtapa
            }
        });
    });
});

//Registrar tercera etapa
router.put("/verificaciones/TerceraEtapa", (req, res) => {
    const {
        FechaTerceraEtapa, DocumentosEnPunto, TramiteId, InformadorTerceraEtapaId,
        IdRespuesta, FichaTerceraEtapa, DescripcionTerceraEtapa,
        TipoDocumentoId, NumeroDocumentoSolicitante, Correo, Celular, Hogar, Orden, IdSolicitud
    } = req.body;

    if (
        !FechaTerceraEtapa || !DocumentosEnPunto || !TramiteId || !InformadorTerceraEtapaId ||
        !IdRespuesta || !FichaTerceraEtapa || !DescripcionTerceraEtapa ||
        !TipoDocumentoId || !NumeroDocumentoSolicitante || !Hogar || !Orden || !IdSolicitud
    )
        return res.status(400).json({ error: "Faltan campos obligatorios de la tercera etapa" });

    const CorreoFinal = Correo && Correo.trim() !== "" ? Correo : null;
    const CelularFinal = Celular && Celular.trim() !== "" ? Celular : null;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: "Error al iniciar la transacción" });

        const sqlSolicitante = `
            INSERT INTO datossolicitantes (TipoDocumentoId, NumeroDocumento, Correo, Celular, Hogar, Orden) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE IdSolicitante = LAST_INSERT_ID(IdSolicitante)
        `;

        db.query(sqlSolicitante, [TipoDocumentoId, NumeroDocumentoSolicitante, CorreoFinal, CelularFinal, Hogar, Orden], (err, resSolicitante) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: "Error en la cosulta o inserción de ddatos del solictante" });
                });
            };

            const SolicitanteTerceraEtapaId = resSolicitante.insertId;

            const sqlTerceraEtapa = `
                UPDATE solicitudes
                SET FechaTerceraEtapa = ?, DocumentosEnPunto = ?, TramiteId = ?, InformadorTerceraEtapaId = ?,
                    IdRespuesta = ?, FichaTerceraEtapa = ?, SolicitanteTerceraEtapaId = ?, DescripcionTerceraEtapa = ?
                WHERE IdSolicitud = ?;
            `;

            db.query(
                sqlTerceraEtapa,
                [FechaTerceraEtapa, DocumentosEnPunto, TramiteId, InformadorTerceraEtapaId, IdRespuesta, FichaTerceraEtapa, SolicitanteTerceraEtapaId, DescripcionTerceraEtapa, IdSolicitud],
                (err, resSolTerceraEtapa) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: "Error en la actualizacion de datos:", err });
                        });
                    };

                    if (resSolTerceraEtapa.affectedRows == 0) {
                        return db.rollback(() => {
                            res.status(404).json({ error: "Ficha no encontrada" });
                        });
                    };

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: "Error en la confirmación de la transacción" });
                            });
                        };

                        res.json({
                            mensaje: "Tercera Etapa actualizada con exito",
                            solicitudActualizada: {
                                IdSolicitud,
                                FechaTerceraEtapa,
                                DocumentosEnPunto,
                                TramiteId,
                                InformadorTerceraEtapaId,
                                IdRespuesta,
                                FichaTerceraEtapa,
                                SolicitanteTerceraEtapaId,
                                DescripcionTerceraEtapa
                            }
                        }
                        );
                    });
                });
        });
    });
});

export default router;
