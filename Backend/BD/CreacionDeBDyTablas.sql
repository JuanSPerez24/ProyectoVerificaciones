CREATE DATABASE verificaciones;
USE verificaciones;

CREATE TABLE tiposdocumento (
    IdTipoDocumento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    SiglaTipoDocumento VARCHAR(10) NOT NULL,
    TextoTipoDocumento VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    IdRol INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL
);

CREATE TABLE puntoatencion (
    IdPuntoAtencion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombrePuntoAtencion VARCHAR(100)
);

CREATE TABLE codigosverificacion (
    IdVerificaciones INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CodigoVerificacion VARCHAR(10) NOT NULL,
    DescripcionVerificacion VARCHAR(200)
);

CREATE TABLE tramiterealizado (
    IdTramite INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreTramite VARCHAR(50)
);

CREATE TABLE tipologias (
    IdTipologia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreTramite VARCHAR(100)
);

CREATE TABLE datossolicitantes (
    IdSolicitante INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TipoDocumentoId INT NOT NULL,
    NumeroDocumento VARCHAR(11) NOT NULL UNIQUE,
    Correo VARCHAR(100),
    Celular VARCHAR(10),
    Hogar INT NOT NULL,
    Orden INT NOT NULL,
    FOREIGN KEY (TipoDocumentoId) REFERENCES tiposdocumento(IdTipoDocumento)
);

CREATE TABLE informador (
    IdInformador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreInformador VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    password VARCHAR(150) NOT NULL,
    TipoDocumentoId INT NOT NULL,
    NumeroDocumento VARCHAR(100) NOT NULL UNIQUE,
    RolId INT,
    Activo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (TipoDocumentoId) REFERENCES tiposdocumento(IdTipoDocumento),
    FOREIGN KEY (RolId) REFERENCES roles(IdRol)
);

CREATE TABLE solicitudes (
    IdSolicitud INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FechaPrimeraEtapa DATE NOT NULL,
    Ficha VARCHAR(21) NOT NULL,
    SolicitantePrimeraEtapaId INT NOT NULL,
    InformadorPrimeraEtapaId INT NOT NULL,
    PuntoAtencionId INT NOT NULL,
    VerificacionId INT NOT NULL,
    DescripcionPrimerEtapa VARCHAR(100) NOT NULL,
    FechaSegundaEtapa DATE,
    Levantamiento TINYINT(1) DEFAULT 0,
    DescripcionSegundaEtapa VARCHAR(100),
    FechaTerceraEtapa DATE,
    DocumentosEnPunto TINYINT(1) DEFAULT 0,
    TramiteId INT,
    InformadorTerceraEtapaId INT,
    IdRespuesta VARCHAR(20),
    FichaTerceraEtapa VARCHAR(21),
    SolicitanteTerceraEtapaId INT,
    DescripcionTerceraEtapa VARCHAR(100),

    FOREIGN KEY (SolicitantePrimeraEtapaId) REFERENCES datossolicitantes(IdSolicitante),
    FOREIGN KEY (InformadorPrimeraEtapaId) REFERENCES informador(IdInformador),
    FOREIGN KEY (PuntoAtencionId) REFERENCES puntoatencion(IdPuntoAtencion),
    FOREIGN KEY (VerificacionId) REFERENCES codigosverificacion(IdVerificaciones),
    FOREIGN KEY (TramiteId) REFERENCES tramiterealizado(IdTramite),
    FOREIGN KEY (InformadorTerceraEtapaId) REFERENCES informador(IdInformador),
    FOREIGN KEY (SolicitanteTerceraEtapaId) REFERENCES datossolicitantes(IdSolicitante)
);

CREATE TABLE tramitetipologias (
    SolicitudId INT,
    TipologiaId INT,
    FOREIGN KEY (SolicitudId) REFERENCES solicitudes(IdSolicitud),
    FOREIGN KEY (TipologiaId) REFERENCES tipologias(IdTipologia)
);
