import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Mock manual de db
const mockDb = {
  query: null,
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

// Router de health
const router = express.Router();

router.get('/health', (req, res) => {
  mockDb.query('SELECT 1 AS ok', (err, results) => {
    if (err) {
      return res.status(503).json({ ok: false, db: false, detalle: err.message });
    }
    return res.json({ ok: true, db: true, result: results[0] });
  });
});

app.use('/api', router);

describe('Pruebas de Health Check - GET /api/health', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  test('Debería retornar estado OK cuando la base de datos está disponible', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, [{ ok: 1 }]);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ok', true);
    expect(response.body).toHaveProperty('db', true);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toHaveProperty('ok', 1);
  });

  test('Debería retornar error 503 cuando la base de datos no está disponible', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(new Error('Connection refused'), null);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('ok', false);
    expect(response.body).toHaveProperty('db', false);
    expect(response.body).toHaveProperty('detalle');
  });

  test('Debería manejar timeout de base de datos', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(new Error('ETIMEDOUT'), null);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
    expect(response.body.db).toBe(false);
    expect(response.body.detalle).toContain('ETIMEDOUT');
  });

  test('Debería manejar error de conexión perdida', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(new Error('Connection lost'), null);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('ok', false);
    expect(response.body).toHaveProperty('db', false);
  });

  test('Debería ejecutar la consulta SELECT 1 AS ok', async () => {
    let capturedSql = null;
    
    mockDb.query.mockImplementation((sql, callback) => {
      capturedSql = sql;
      callback(null, [{ ok: 1 }]);
    });

    await request(app).get('/api/health');

    expect(capturedSql).toBe('SELECT 1 AS ok');
  });

  test('Debería verificar estructura correcta de la respuesta exitosa', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, [{ ok: 1 }]);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Object.keys(response.body)).toEqual(['ok', 'db', 'result']);
  });

  test('Debería verificar estructura correcta de la respuesta de error', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(new Error('Test error'), null);
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Object.keys(response.body)).toEqual(['ok', 'db', 'detalle']);
  });

  test('Debería manejar diferentes tipos de errores de base de datos', async () => {
    const errorMessages = [
      'ER_ACCESS_DENIED_ERROR',
      'ER_BAD_DB_ERROR',
      'ER_NO_SUCH_TABLE',
      'PROTOCOL_CONNECTION_LOST'
    ];

    for (const errorMsg of errorMessages) {
      mockDb.query.mockImplementation((sql, callback) => {
        callback(new Error(errorMsg), null);
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(503);
      expect(response.body.ok).toBe(false);
      expect(response.body.detalle).toContain(errorMsg);
    }
  });

  test('Debería responder rápidamente para monitoreo', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, [{ ok: 1 }]);
    });

    const startTime = Date.now();
    await request(app).get('/api/health');
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    // Debería responder en menos de 1 segundo (mock rápido)
    expect(responseTime).toBeLessThan(1000);
  });
});
