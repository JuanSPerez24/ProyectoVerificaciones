const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const app = express();

app.use(express.json());
app.use(cors());

//Crear un nuevo usuario
app.post("/api/informador", (req, res) => {
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
app.put("/api/ModInformador", (req, res) => {
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


//Crear una solicitud (Registrar primera etapa)
app.post("/api/verificaciones/solicitudes", (req, res) => {

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
app.put("/api/Verificaciones/SegundaEtapa", (req, res) => {
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
app.put("/api/verificaciones/TerceraEtapa", (req, res) => {
    const {
        FechaTerceraEtapa, DocumentosEnPunto, TramiteId, InformadorTerceraEtapaId,
        IdRespuesta, FichaTerceraEtapa, DescripcionTerceraEtapa,
        TipoDocumentoId, NumeroDocumentoSolicitante, Correo, Celular, Hogar, Orden, IdSolicitud
    } = req.body;

    if (
        !FechaTerceraEtapa || !DocumentosEnPunto || !TramiteId || !InformadorTerceraEtapaId ||
        !IdRespuesta || !FichaTerceraEtapa || !DescripcionTerceraEtapa ||
        !TipoDocumentoId || !NumeroDocumentoSolicitante || !Celular || !Hogar || !Orden || !IdSolicitud
    )
        return res.status(400).json({ error: "Faltan campos obligatorios de la tercera etapa" });

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

app.get("/api/Busqueda", (req, res) => {
    const { estado, texto } = req.query;

    if (!estado) {
        return res.status(400).json({ error: "Falta el parámetro 'estado' para realizar la búsqueda." });
    }

    const estadoNum = parseInt(estado, 10); // 🔹 convertir a número

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

//Obtener datos de los usuarios
app.get("/api/verificaciones/informador", (req, res) => {
    db.query("SELECT * FROM informador;", (err, resultados) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        res.json(resultados);
    })
});

//Obtene codigos en verificación
app.get("/api/CodigosVerificaciones", (req, res) => {
    db.query("SELECT * FROM codigosverificacion;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de codigos de verificación" });
        res.json(resultado);
    });
});

//Obtener tipologias
app.get("/api/Tipologias", (req, res) => {
    db.query("SELECT * FROM tipologias;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de de tipologias" });
        res.json(resultado);
    });
});

//Obtener tramite realizado
app.get("/api/Tramites", (req, res) => {
    db.query("SELECT * FROM tramiterealizado;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de tramites" });
        res.json(resultado);
    });
});

//Obtener puntos de atención
app.get("/api/PutnosDeAtencion", (req, res) => {
    db.query("SELECT * FROM puntoatencion", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de puntos de atención" });
        res.json(resultado);
    });
});

//Obtener Tipo de documento
app.get("/api/TipoDeDocumento", (err, res) => {
    db.query("SELECT * FROM tiposdocumento", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de Tipo de documento" });
        res.json(resultado);
    });
});



//Dar el link del localhost
app.listen(3000, () => {
    console.log("El servidor esta corriendo en el servidor http://localhost:3000");
});
