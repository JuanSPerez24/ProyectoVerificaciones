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

// Router de búsqueda
const router = express.Router();

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

    mockDb.query(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error al ejecutar la búsqueda", detalle: err.message });
        }

        res.json({ cantidad: rows.length, datos: rows });
    });
});

app.use('/api', router);

describe('Pruebas de Búsqueda - GET /api/Busqueda', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  test('Debería buscar solicitudes por estado 1 (Primera etapa)', async () => {
    const mockResults = [
      {
        FechaPrimeraEtapa: '2024-01-15',
        Ficha: '123456',
        NombrePuntoAtencion: 'Punto A',
        DescripcionPrimerEtapa: 'Descripción primera etapa',
        FechaSegundaEtapa: null,
        DescripcionSegundaEtapa: null,
        FechaTerceraEtapa: null,
        DocumentosEnPunto: null,
        NombreTramite: 'Trámite 1',
        IdRespuesta: 'RESP-001'
      }
    ];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ estado: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cantidad', 1);
    expect(response.body).toHaveProperty('datos');
    expect(response.body.datos).toHaveLength(1);
    expect(response.body.datos[0]).toHaveProperty('Ficha', '123456');
  });

  test('Debería buscar solicitudes por estado 2 (Segunda etapa)', async () => {
    const mockResults = [
      {
        FechaPrimeraEtapa: '2024-01-15',
        Ficha: '789012',
        NombrePuntoAtencion: 'Punto B',
        DescripcionPrimerEtapa: 'Descripción primera etapa',
        FechaSegundaEtapa: '2024-01-20',
        DescripcionSegundaEtapa: 'Descripción segunda etapa',
        FechaTerceraEtapa: null,
        DocumentosEnPunto: 'Sí',
        NombreTramite: 'Trámite 2',
        IdRespuesta: 'RESP-002'
      }
    ];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ estado: 2 });

    expect(response.status).toBe(200);
    expect(response.body.cantidad).toBe(1);
    expect(response.body.datos[0].FechaSegundaEtapa).not.toBeNull();
    expect(response.body.datos[0].FechaTerceraEtapa).toBeNull();
  });

  test('Debería buscar solicitudes por estado 3 (Tercera etapa - Completas)', async () => {
    const mockResults = [
      {
        FechaPrimeraEtapa: '2024-01-15',
        Ficha: '345678',
        NombrePuntoAtencion: 'Punto C',
        DescripcionPrimerEtapa: 'Descripción primera etapa',
        FechaSegundaEtapa: '2024-01-20',
        DescripcionSegundaEtapa: 'Descripción segunda etapa',
        FechaTerceraEtapa: '2024-01-25',
        DocumentosEnPunto: 'Sí',
        NombreTramite: 'Trámite 3',
        IdRespuesta: 'RESP-003'
      }
    ];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ estado: 3 });

    expect(response.status).toBe(200);
    expect(response.body.cantidad).toBe(1);
    expect(response.body.datos[0].FechaTerceraEtapa).not.toBeNull();
  });

  test('Debería buscar con filtro de texto', async () => {
    const mockResults = [
      {
        FechaPrimeraEtapa: '2024-01-15',
        Ficha: '123456',
        NombrePuntoAtencion: 'Punto A',
        DescripcionPrimerEtapa: 'Verificación de documentos',
        FechaSegundaEtapa: null,
        DescripcionSegundaEtapa: null,
        FechaTerceraEtapa: null,
        DocumentosEnPunto: null,
        NombreTramite: 'Trámite 1',
        IdRespuesta: 'RESP-001'
      }
    ];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ 
        estado: 1,
        texto: 'documentos'
      });

    expect(response.status).toBe(200);
    expect(response.body.cantidad).toBe(1);
    expect(response.body.datos[0].DescripcionPrimerEtapa).toContain('documentos');
  });

  test('Debería rechazar búsqueda sin parámetro estado', async () => {
    const response = await request(app)
      .get('/api/Busqueda')
      .query({ texto: 'test' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('estado');
  });

  test('Debería devolver array vacío cuando no hay resultados', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ estado: 1 });

    expect(response.status).toBe(200);
    expect(response.body.cantidad).toBe(0);
    expect(response.body.datos).toHaveLength(0);
  });

  test('Debería manejar errores de base de datos', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ estado: 1 });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error al ejecutar la búsqueda');
  });

  test('Debería buscar por número de ficha', async () => {
    const mockResults = [
      {
        FechaPrimeraEtapa: '2024-01-15',
        Ficha: '999888',
        NombrePuntoAtencion: 'Punto D',
        DescripcionPrimerEtapa: 'Descripción',
        FechaSegundaEtapa: null,
        DescripcionSegundaEtapa: null,
        FechaTerceraEtapa: null,
        DocumentosEnPunto: null,
        NombreTramite: 'Trámite',
        IdRespuesta: 'RESP-004'
      }
    ];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app)
      .get('/api/Busqueda')
      .query({ 
        estado: 1,
        texto: '999888'
      });

    expect(response.status).toBe(200);
    expect(response.body.cantidad).toBe(1);
    expect(response.body.datos[0].Ficha).toBe('999888');
  });
});
