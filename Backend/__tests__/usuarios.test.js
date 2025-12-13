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

// Router de usuarios
const router = express.Router();

router.post("/Usuario/Nuevo", (req, res) => {
    const { NombreInformador,Correo,password,IdTipoDocumento,NumeroDocumento,IdRol } = req.body;
    if (!NombreInformador || !Correo || !password || !IdTipoDocumento || !NumeroDocumento || !IdRol) {
        return res.status(400).json({ error: "Faltan campos requeridos" })
    }
    mockDb.query(`INSERT INTO informador (NombreInformador, Correo, password, TipoDocumentoId, NumeroDocumento, RolId) VALUES (? ,? , ?, ?, ?, ?)`,[NombreInformador,Correo,password,IdTipoDocumento,NumeroDocumento,IdRol],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: "Error en la inserción de datos del informador" });
            res.json({mensaje: "Usuario creado con éxito."});
        }
    );
});

router.put("/Usuario/Mod", (req, res) => {
    const { NombreInformador, Correo, RolId, TipoDocumentoId, NumeroDocumento, IdInformador, Activo } = req.body;
    if (!NombreInformador || !Correo || !RolId || !TipoDocumentoId || !NumeroDocumento || !IdInformador) return res.status(500).json({ error: "Faltan campos obligatorios" });

    mockDb.query(`UPDATE informador SET NombreInformador = ?, Correo = ?, RolId = ?, TipoDocumentoId = ?, NumeroDocumento = ?, Activo = ? WHERE IdInformador = ?;`, 
        [NombreInformador, Correo, RolId, TipoDocumentoId, NumeroDocumento, Activo, IdInformador], (err, resultado) => {
        if (err) return res.status(500).json({ error: "Erro en la actualizacion de datos del informador" });
        if (resultado.affectedRows == 0) return res.status(500).json({ error: "ID usuario no encontrado" });
        res.json({ mensaje: "Informador actualizdo", InformadorActualizado: { NombreInformador, Correo, RolId, TipoDocumentoId, NumeroDocumento, IdInformador, Activo } });
    });
});

router.put("/Usuario/ModPass", (req, res) => {
    const { IdInformador, NuevaContraseña } = req.body;
    if (!NuevaContraseña || !IdInformador) return res.status(500).json({ error: "Faltan campos obligatorios" });

    mockDb.query(`UPDATE  informador SET password = ? WHERE IdInformador = ?`, [NuevaContraseña, IdInformador], (err, resultado) =>{
        if (err) return res.status(500).json({error: "Error en al actualizacion de la contraseña."});
        if(resultado.affectedRows == 0) return res.status(500).json({error: "ID usuarios no entrado"});
        res.json({ mensaje: "Contraseña cambiada con éxito" });
    });
});

router.get("/Usuarios", (req, res) => {
    mockDb.query(`SELECT IdInformador,NombreInformador, Correo, NombreRol , SiglaTipoDocumento, NumeroDocumento, RolId, TipoDocumentoId, Activo FROM informador i
        INNER JOIN tiposdocumento on IdTipoDocumento = TipoDocumentoId
        INNER JOIN roles r on i.RolId = r.IdRol;`, (err, resultados) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        res.json(resultados);
    })
});

app.use('/api', router);

describe('Pruebas de Gestión de Usuarios', () => {
  
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  test('Debería crear un nuevo usuario', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, { insertId: 5 });
    });

    const response = await request(app).post('/api/Usuario/Nuevo').send({
      NombreInformador: 'Juan Pérez',
      Correo: 'juan@example.com',
      password: 'pass123',
      IdTipoDocumento: 1,
      NumeroDocumento: '123456',
      IdRol: 2
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje');
  });

  test('Debería rechazar creación sin campos', async () => {
    const response = await request(app).post('/api/Usuario/Nuevo').send({ NombreInformador: 'Test' });
    expect(response.status).toBe(400);
  });

  test('Debería modificar un usuario', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put('/api/Usuario/Mod').send({
      NombreInformador: 'Juan',
      Correo: 'juan@example.com',
      RolId: 1,
      TipoDocumentoId: 1,
      NumeroDocumento: '123',
      IdInformador: 5,
      Activo: 1
    });

    expect(response.status).toBe(200);
  });

  test('Debería cambiar contraseña', async () => {
    mockDb.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put('/api/Usuario/ModPass').send({
      IdInformador: 5,
      NuevaContraseña: 'nueva123'
    });

    expect(response.status).toBe(200);
  });

  test('Debería obtener lista de usuarios', async () => {
    const mockData = [{ IdInformador: 1, NombreInformador: 'Test', Correo: 'test@example.com' }];
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get('/api/Usuarios');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
