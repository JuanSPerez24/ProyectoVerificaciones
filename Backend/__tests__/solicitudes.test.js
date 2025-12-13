import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Mock manual de db con soporte para transacciones
const mockDb = {
  query: null,
  beginTransaction: null,
  commit: null,
  rollback: null,
  _calls: [],
  _mockImplementation: null
};

mockDb.query = function(...args) {
  mockDb._calls.push(args);
  if (mockDb._mockImplementation) {
    return mockDb._mockImplementation(...args);
  }
};

mockDb.query.mockImplementation = function(fn) {
  mockDb._mockImplementation = fn;
  return mockDb.query;
};

mockDb.query.mockClear = function() {
  mockDb._calls = [];
  mockDb._mockImplementation = null;
};

mockDb.beginTransaction = function(callback) { callback(null); };
mockDb.commit = function(callback) { callback(null); };
mockDb.rollback = function(callback) { callback(); };

// Router de solicitudes (versión simplificada)
const router = express.Router();

router.post("/verificaciones", (req, res) => {
    const { Ficha } = req.body;
    if (!Ficha) return res.status(400).json({ error: "Falta el campo 'Ficha'" });

    mockDb.query(`SELECT s.* FROM solicitudes s WHERE s.Ficha = ? LIMIT 1;`, [Ficha], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la búsqueda" });
        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ninguna solicitud con esa ficha" });
        }
        res.json(resultado);
    });
});

router.put("/verificaciones/SegundaEtapa", (req, res) => {
    const { FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa, IdSolicitud } = req.body;
    if (!FechaSegundaEtapa || !Levantamiento || !DescripcionSegundaEtapa || !IdSolicitud) 
        return res.status(400).json({ error: "Faltan campos obligatorios" });

    mockDb.query(`UPDATE solicitudes SET FechaSegundaEtapa = ?, Levantamiento = ?, DescripcionSegundaEtapa = ? WHERE IdSolicitud = ?;`,
        [FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa, IdSolicitud], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en al actualizacion de datos" });
        if (resultado.affectedRows == 0) return res.status(404).json({ error: "Ficha no encontrada" });
        res.json({ mensaje: "Segunda etapa actualizada correctamente", solicitudActualizada: { IdSolicitud, FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa } });
    });
});

app.use('/api', router);

describe('Pruebas de Solicitudes', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  describe('POST /api/verificaciones', () => {
    test('Debería encontrar una solicitud por ficha', async () => {
      const mockResult = [{ IdSolicitud: 1, Ficha: '123456' }];
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(null, mockResult);
      });

      const response = await request(app).post('/api/verificaciones').send({ Ficha: '123456' });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Debería retornar 404 cuando no encuentra ficha', async () => {
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const response = await request(app).post('/api/verificaciones').send({ Ficha: '999999' });
      expect(response.status).toBe(404);
    });

    test('Debería rechazar sin campo Ficha', async () => {
      const response = await request(app).post('/api/verificaciones').send({});
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/verificaciones/SegundaEtapa', () => {
    test('Debería actualizar segunda etapa', async () => {
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app).put('/api/verificaciones/SegundaEtapa').send({
        FechaSegundaEtapa: '2024-01-20',
        Levantamiento: 'Completado',
        DescripcionSegundaEtapa: 'Test',
        IdSolicitud: 1
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
    });

    test('Debería rechazar sin campos obligatorios', async () => {
      const response = await request(app).put('/api/verificaciones/SegundaEtapa').send({ FechaSegundaEtapa: '2024-01-20' });
      expect(response.status).toBe(400);
    });

    test('Debería retornar 404 si no existe', async () => {
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      const response = await request(app).put('/api/verificaciones/SegundaEtapa').send({
        FechaSegundaEtapa: '2024-01-20',
        Levantamiento: 'Test',
        DescripcionSegundaEtapa: 'Test',
        IdSolicitud: 999
      });

      expect(response.status).toBe(404);
    });
  });
});
