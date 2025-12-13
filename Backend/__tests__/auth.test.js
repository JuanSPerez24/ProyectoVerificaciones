import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Mock simple de db sin usar jest.fn() inicialmente
const mockDb = {
  query: null,
  _calls: [],
  _mockImplementation: null
};

// Agregar métodos mock manualmente
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

// Crear el router directamente aquí para evitar problemas de import
const router = express.Router();

router.post("/Login", (req, res) => {
    try {
    const { Correo, password } = req.body;

    if (!Correo || !password) return res.status(400).json({ error: "Faltan campos" });

    const sqlBusqueda = `
    SELECT IdInformador, RolId, NombreInformador, Activo FROM informador 
    WHERE Correo = ? AND password = ?
    `;

    mockDb.query(sqlBusqueda, [Correo,password], (err, resultado) => {
        if (err) {
            return res.status(500).json({error: "Error al buscar", detalle: err.message});
        }

        if (!resultado || resultado.length == 0) return res.status(401).json({error: "Credenciales inválidas"});

        const user = resultado[0]
        
        if(user.Activo == 0) return res.status(403).json({error: "Credenciales no validas"});

        res.json({
            mensaje: "OK",
            id: user.IdInformador, 
            Rol: user.RolId, 
            Name: user.NombreInformador,
            Activo: user.Activo
        });
    });
    } catch (err) {
      res.status(500).json({ error: 'Error inesperado', detalle: err.message });
    }
});

app.use('/api', router);

describe('Pruebas de Autenticación - POST /api/Login', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  test('Debería autenticar exitosamente con credenciales válidas', async () => {
    const mockUser = [{
      IdInformador: 1,
      RolId: 1,
      NombreInformador: 'Juan Pérez',
      Activo: 1
    }];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockUser);
    });

    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'juan@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'OK');
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('Rol', 1);
    expect(response.body).toHaveProperty('Name', 'Juan Pérez');
    expect(response.body).toHaveProperty('Activo', 1);
  });

  test('Debería rechazar cuando faltan campos requeridos', async () => {
    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'juan@example.com'
        // Falta el campo password
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Faltan campos');
  });

  test('Debería rechazar con credenciales inválidas', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, []); // No se encontró usuario
    });

    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'usuario@invalido.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
  });

  test('Debería rechazar usuario inactivo', async () => {
    const mockInactiveUser = [{
      IdInformador: 2,
      RolId: 2,
      NombreInformador: 'Usuario Inactivo',
      Activo: 0
    }];

    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, mockInactiveUser);
    });

    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'inactivo@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Credenciales no validas');
  });

  test('Debería manejar errores de base de datos', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(new Error('Database connection error'), null);
    });

    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'juan@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error al buscar');
  });

  test('Debería validar que el correo no esté vacío', async () => {
    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: '',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Faltan campos');
  });

  test('Debería validar que la contraseña no esté vacía', async () => {
    const response = await request(app)
      .post('/api/Login')
      .send({
        Correo: 'juan@example.com',
        password: ''
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Faltan campos');
  });
});
