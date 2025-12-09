import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/health', (req, res) => {
  db.query('SELECT 1 AS ok', (err, results) => {
    if (err) {
      console.error('Health check DB error:', err);
      return res.status(503).json({ ok: false, db: false, detalle: err.message });
    }
    return res.json({ ok: true, db: true, result: results[0] });
  });
});

export default router;
