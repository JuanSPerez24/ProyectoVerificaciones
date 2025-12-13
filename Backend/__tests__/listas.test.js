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

// Router de listas desplegables
const router = express.Router();

router.get("/CodigosVerificaciones", (req, res) => {
    mockDb.query("SELECT * FROM codigosverificacion;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de codigos de verificación" });
        res.json(resultado);
    });
});

router.get("/Tipologias", (req, res) => {
    mockDb.query("SELECT * FROM tipologias;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de de tipologias" });
        res.json(resultado);
    });
});

router.get("/Tramites", (req, res) => {
    mockDb.query("SELECT * FROM tramiterealizado;", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de tramites" });
        res.json(resultado);
    });
});

router.get("/PuntosDeAtencion", (req, res) => {
    mockDb.query("SELECT * FROM puntoatencion", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de puntos de atención" });
        res.json(resultado);
    });
});

router.get("/TipoDeDocumento", (err, res) => {
    mockDb.query("SELECT * FROM tiposdocumento", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de Tipo de documento" });
        res.json(resultado);
    });
});

router.get("/Roles", (req, res) => {
    mockDb.query("SELECT * FROM roles", (err, resultado) => {
        if (err) return res.status(500).json({ error: "Error en la consulta de Roles" });
        res.json(resultado);
    });
});

app.use('/api', router);

describe('Pruebas de Listas Desplegables', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  test('Debería obtener códigos de verificación', async () => {
    const mockData = [{ IdCodigoVerificacion: 1, NombreCodigoVerificacion: 'Test' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/CodigosVerificaciones');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Debería obtener tipologías', async () => {
    const mockData = [{ IdTipologia: 1, NombreTipologia: 'Tipo A' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/Tipologias');
    expect(response.status).toBe(200);
  });

  test('Debería obtener trámites', async () => {
    const mockData = [{ IdTramite: 1, NombreTramite: 'Trámite 1' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/Tramites');
    expect(response.status).toBe(200);
  });

  test('Debería obtener puntos de atención', async () => {
    const mockData = [{ IdPuntoAtencion: 1, NombrePuntoAtencion: 'Punto A' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/PuntosDeAtencion');
    expect(response.status).toBe(200);
  });

  test('Debería obtener tipos de documento', async () => {
    const mockData = [{ IdTipoDocumento: 1, SiglaTipoDocumento: 'CC' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/TipoDeDocumento');
    expect(response.status).toBe(200);
  });

  test('Debería obtener roles', async () => {
    const mockData = [{ IdRol: 1, NombreRol: 'Admin' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/Roles');
    expect(response.status).toBe(200);
  });

  test('Debería manejar errores de BD', async () => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(new Error('DB error'), null);
    });

    const response = await request(app).get('/api/Roles');
    expect(response.status).toBe(500);
  });
});
