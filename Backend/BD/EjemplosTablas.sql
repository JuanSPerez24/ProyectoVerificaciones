USE verificaciones;

INSERT INTO tiposdocumento (IdTipoDocumento, SiglaTipoDocumento, TextoTipoDocumento) VALUES
(1,'TI','Tarjeta de identidad'),
(2,'CC','Cédula de ciudadanía'),
(3,'PPT','Permiso de protección temporal'),
(4,'SCR','Salvoconducto para refugiado'),
(5,'CE','Cédula de extranjería');

INSERT INTO tramiterealizado (IdTramite, NombreTramite) VALUES
(1, 'Solicitud de encuesta'),
(2, 'Documentos incompletos'),
(3, 'Trámite no aplica');

INSERT INTO tipologias (IdTipologia, NombreTramite) VALUES
(1, 'Retiro orden 1'),
(2, 'Identificación');

INSERT INTO puntoatencion (IdPuntoAtencion, NombrePuntoAtencion) VALUES
(1, 'CADE CANDELARIA'),
(2, 'CADE FONTIBON'),
(3, 'CADE GAITANA'),
(4, 'CADE KENNEDY'),
(5, 'CADE LA VICTORIA'),
(6, 'CADE LOS LUCEROS'),
(7, 'CADE MANITAS'),
(8, 'CADE SANTA HELENITA'),
(9, 'CADE SANTA LUCIA'),
(10, 'CADE SERVITA'),
(11, 'CADE TUNAL'),
(12, 'CADE YOMASA'),
(13, 'SUPERCADE 20 DE JULIO'),
(14, 'SUPERCADE AMERICAS'),
(15, 'SUPERCADE BOSA'),
(16, 'SUPERCADE CAD'),
(17, 'SUPERCADE ENGATIVA'),
(18, 'SUPERCADE SUBA');

INSERT INTO roles (IdRol, NombreRol) VALUES
(1, 'Administrador'),
(2, 'Digitador');

INSERT INTO informador (IdInformador, NombreInformador, Correo, Password, RolId, TipoDocumentoId, NumeroDocumento) VALUES
(1,'Juan Sebastian Perez Rodriguez','sebastianperez11321@gmail.com',1 ,1 ,2 ,'1032676059'),
(2, 'Laura Vanessa Torres Garcia', 'laura.torres@gmail.com', 2, 2, 2, '1002456789'),
(3, 'Miguel Angel Rodriguez Castro', 'miguel.rodriguez@gmail.com', 2, 2, 1, '9876543210');

INSERT INTO codigosverificacion (IdVerificaciones, CodigoVerificacion, DescripcionVerificacion) VALUES
(1,'30','30 - Verificación - Jefe de hogar - Por denuncia'),
(2,'31','31 - Verificación - Miembros del hogar - Por denuncia'),
(3,'32','32 - Verificación - Inconsistencias en procedimiento'),
(4,'40','40 - Verificación - Desactualización sección E - Salud y fecundidad'),
(5,'44','44 - Verificación - Actividad principal último mes'),
(6,'50','50 - Calidad encuesta - Movimiento atípico entre fichas'),
(7,'51','51 - Calidad encuesta - Inclusión atípica de personas'),
(8,'52','52 - Calidad encuesta - Personas con discapacidad'),
(9,'53','53 - Calidad encuesta - Parentesco “no pariente”'),
(10,'54','54 - Calidad encuesta - Parentesco “otro parentesco”'),
(11,'55','55 - Calidad encuesta - Inclusión atípica'),
(12,'60','60 - Datos no válidos - Imposible calcular nivel'),
(13,'60','60 - Excluido - Datos no válidos fechas'),
(14,'61','61 - Calidad encuesta - Parentescos inconsistentes'),
(15,'62','62 - Calidad encuesta - Educación - grado alcanzado'),
(16,'63','63 - Calidad encuesta - Datos sociodemográficos'),
(17,'64','64 - Calidad encuesta - Salud y fecundidad'),
(18,'65','65 - Calidad encuesta - Ocupación e ingresos'),
(19,'66','66 - Calidad encuesta - Vivienda'),
(20,'67','67 - Calidad encuesta - Hogares'),
(21,'68','68 - Calidad encuesta - N° cuartos vivienda'),
(22,'69','69 - Calidad encuesta - Distancia fuera de parámetros'),
(23,'70','70 - Excluido - Documento no válido'),
(24,'71','71 - Excluido - Documento duplicado'),
(25,'90','90 - Calidad del registro - Vivienda'),
(26,'91','91 - Calidad del registro - Nivel educativo'),
(27,'92','92 - Calidad del registro - Ocupación del hogar');

INSERT INTO datossolicitantes (IdSolicitante, TipoDocumentoId, NumeroDocumento, Correo, Celular, Hogar, Orden) VALUES
(1, 2, '1000000001', 'solicitante1@mail.com', '3001111111', 1, 1),
(2, 1, '1000000002', 'solicitante2@mail.com', '3002222222', 1, 2),
(3, 2, '1000000003', 'solicitante3@mail.com', '3003333333', 1, 1),
(4, 5, '1000000004', 'solicitante4@mail.com', '3004444444', 1, 1),
(5, 3, '1000000005', 'solicitante5@mail.com', '3005555555', 1, 1);

INSERT INTO solicitudes (
    FechaPrimeraEtapa, Ficha, SolicitantePrimeraEtapaId, InformadorPrimeraEtapaId,
    PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa
)
VALUES
('2025-09-14', '11110', 1, 1, 4, 4, 'Primera Etapa'),
('2025-09-15', '11111', 2, 3, 5, 5, 'Primera Etapa'),
('2025-09-16', '11112', 3, 1, 6, 6, 'Primera Etapa'),
('2025-09-17', '11113', 4, 3, 7, 7, 'Primera Etapa'),
('2025-09-18', '11114', 5, 1, 8, 8, 'Primera Etapa'),
('2025-09-19', '11115', 1, 1, 9, 9, 'Primera Etapa'),
('2025-09-01', '11116', 2, 3, 10, 10, 'Primera Etapa'),
('2025-09-02', '11117', 3, 3, 11, 11, 'Primera Etapa'),
('2025-09-03', '11118', 4, 3, 12, 12, 'Primera Etapa'),
('2025-09-04', '11119', 5, 1, 13, 13, 'Primera Etapa');

INSERT INTO solicitudes (
    FechaPrimeraEtapa, Ficha, SolicitantePrimeraEtapaId, InformadorPrimeraEtapaId,
    PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa,
    FechaSegundaEtapa, Levantamiento
)
VALUES
('2025-09-14', '11120', 1, 1, 4, 4, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-15', '11121', 2, 3, 5, 5, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-16', '11122', 3, 1, 6, 6, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-17', '11123', 4, 3, 7, 7, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-18', '11124', 5, 1, 8, 8, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-19', '11125', 1, 1, 9, 9, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-01', '11126', 2, 3, 10, 10, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-02', '11127', 3, 3, 11, 11, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-03', '11128', 4, 3, 12, 12, 'Segunda Etapa', '2024-10-30', 1),
('2025-09-04', '11129', 5, 1, 13, 13, 'Segunda Etapa', '2024-10-30', 1);

INSERT INTO solicitudes (
    FechaPrimeraEtapa, Ficha, SolicitantePrimeraEtapaId, InformadorPrimeraEtapaId,
    PuntoAtencionId, VerificacionId, DescripcionPrimerEtapa,
    FechaSegundaEtapa, Levantamiento, DescripcionSegundaEtapa,
    FechaTerceraEtapa, DocumentosEnPunto, TramiteId,
    InformadorTerceraEtapaId, IdRespuesta, FichaTerceraEtapa,
    SolicitanteTerceraEtapaId, DescripcionTerceraEtapa
)
VALUES
('2025-09-04','11130',1,1,13,13,'Tercera Etapa','2024-10-30',1,'Tercera Etapa','2025-11-18',1,1,3,'123456','12345678765',3,'Tercera Etapa'),
('2025-09-04','11131',1,2,13,13,'Tercera Etapa','2024-10-30',1,'Tercera Etapa','2025-11-18',1,1,2,'123456','12345678765',2,'Tercera Etapa'),
('2025-09-04','11132',1,3,13,13,'Tercera Etapa','2024-10-30',1,'Tercera Etapa','2025-11-18',1,1,1,'123456','12345678765',5,'Tercera Etapa');

INSERT INTO tramitetipologias (SolicitudId, TipologiaId) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 2),
(5, 1),
(6, 2),
(7, 1),
(8, 2),
(9, 1),
(10, 2),
(11, 1),
(12, 2),
(13, 1),
(14, 2),
(15, 1),
(16, 2),
(17, 1),
(18, 2),
(19, 1),
(20, 2),
(21, 1),
(22, 2),
(23, 1);
