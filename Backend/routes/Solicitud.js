import express from "express";
import db from "../db.js";

const router = express.Router()

//Obtene codigos en verificación
router.get("/CodigosVerificaciones", (req, res) => {
    db.query("SELECT * FROM codigosverificacion;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de codigos de verificación" });
        res.json(resultado);
    });
});

//Obtener tipologias
router.get("/Tipologias", (req, res) => {
    db.query("SELECT * FROM tipologias;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de de tipologias" });
        res.json(resultado);
    });
});

//Obtener tramite realizado
router.get("/Tramites", (req, res) => {
    db.query("SELECT * FROM tramiterealizado;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de tramites" });
        res.json(resultado);
    });
});

//Obtener puntos de atención
router.get("/PuntosDeAtencion", (req, res) => {
    db.query("SELECT * FROM puntoatencion", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de puntos de atención" });
        res.json(resultado);
    });
});

//Obtener Tipo de documento
router.get("/TipoDeDocumento", (err, res) => {
    db.query("SELECT * FROM tiposdocumento", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de Tipo de documento" });
        res.json(resultado);
    });
});

export default router;