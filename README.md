# 📋 Sistema de Gestión de Marcas en Verificación

Aplicación web completa para la **gestión, registro y consulta de solicitudes de verificación de marcas**, desarrollada con **Node.js (Express)** en el backend y **HTML/CSS/JavaScript** en el frontend.

El sistema permite a los usuarios registrar nuevas solicitudes, buscar solicitudes existentes con filtros avanzados, y proporciona un panel de administración para gestionar usuarios y roles.

---

## 🎯 Características Principales

✅ **Autenticación segura** con control de acceso por roles  
✅ **Registro de solicitudes** con formulario multi-etapa  
✅ **Búsqueda avanzada** con filtros por estado y texto  
✅ **Consulta detallada** de solicitudes por ficha  
✅ **Gestión de usuarios** (solo administradores)  
✅ **API REST** completamente documentada  
✅ **Diseño responsivo** (desktop, tablet, móvil)  
✅ **Base de datos relacional** con scripts de inicialización

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL 8.0** - Base de datos relacional
- **CORS** - Control de acceso de origen cruzado

### Frontend
- **HTML5** - Estructura
- **CSS3 + Bootstrap 5.3** - Estilos y diseño responsivo
- **JavaScript Vanilla** - Lógica e interactividad

### DevOps
- **npm** - Gestor de paquetes
- **Git** - Control de versiones

---

## 📂 Estructura del Proyecto

```
ProyectoVerificaciones/
├── README.md                          # Este archivo
│
├── Backend/
│   ├── server.js                     # Punto de entrada del servidor
│   ├── db.js                         # Configuración de BD
│   ├── package.json                  # Dependencias de npm
│   ├── package-lock.json             # Lock de versiones
│   ├── .env                          # Variables de entorno
│   │
│   ├── BD/                           # Scripts de base de datos
│   │   ├── CreacionDeBDyTablas.sql   # Crear estructura
│   │   └── EjemplosTablas.sql        # Datos de ejemplo
│   │
│   ├── routes/                       # Controladores de rutas
│   │   ├── Login.js
│   │   ├── BusquedaPorTextoYEstado.js
│   │   ├── DetalladoSolictud.js
│   │   ├── ListasDesplegables.js
│   │   └── UsuariosModificacionYRegistro.js
│   │
│   └── test.rest                     # Pruebas de API (REST Client)
│
└── Frontend/
    ├── index.html                    # Página de login
    │
    ├── HTML/                         # Vistas de la aplicación
    │   ├── Buscar.html               # Búsqueda de solicitudes
    │   ├── RegistroYconsulta.html    # Nuevo registro (3 etapas)
    │   └── Usuarios.html             # Gestión de usuarios (admin)
    │
    ├── JS/                           # Lógica JavaScript
    │   ├── Ingresar.js               # Autenticación
    │   ├── BusquedaPorTextoYEstado.js
    │   ├── ConsultasPorFicha.js
    │   ├── UsuarioCreacionModificacion.js
    │   ├── VerificacionRol.js        # Control de acceso
    │   └── CerrarSesion.js
    │
    ├── CSS/
    │   └── style.css                 # Estilos personalizados
    │
    └── assets/
        └── Imagenes/
            └── Fondo.jpeg            # Imagen de fondo
```

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ ([Descargar](https://nodejs.org/))
- MySQL 8.0+ o SQL Server
- Git (opcional)

### Instalación (5 minutos)

**1. Clonar o descargar el proyecto**
```bash
git clone https://github.com/JuanSPerez24/ProyectoVerificaciones.git
cd ProyectoVerificaciones
```

**2. Instalar dependencias**
```bash
cd Backend
npm install
```

**3. Crear base de datos**
```bash
# Abrir MySQL o SQL Server y ejecutar:
# Backend/BD/CreacionDeBDyTablas.sql
# Backend/BD/EjemplosTablas.sql
```

**4. Iniciar servidor**
```bash
node server.js
```

**5. Acceder a la aplicación**
```
http://localhost:3000
```

**Credenciales de prueba:**
- Email: `admin@ejemplo.com`
- Contraseña: `admin123`

---

## 📊 Roles y Permisos

| Funcionalidad | Admin | Usuario Normal | Revisor |
|---|:---:|:---:|:---:|
| Login | ✅ | ✅ | ✅ |
| Nuevo Registro | ✅ | ✅ | ❌ |
| Editar Solicitud | ✅ | ✅ | ❌ |
| Buscar Solicitudes | ✅ | ✅ | ✅ |
| Ver Usuarios | ✅ | ❌ | ❌ |
| Crear Usuarios | ✅ | ❌ | ❌ |
| Reportes | ✅ | ❌ | ✅ |

---

## 🔐 Seguridad

- 🔒 Autenticación con validación de credenciales
- 🔐 Control de acceso basado en roles
- 📝 Validación de entrada en todos los formularios
- 🛡️ CORS habilitado para desarrollo

---

## 🗄️ Base de Datos

### Tablas Principales
- **usuarios** - Usuarios del sistema con roles
- **solicitudes** - Solicitudes de verificación (3 etapas)
- **documentos** - Archivos adjuntos
- **listas_desplegables** - Puntos, tipos de trámite, etc.

### Scripts Incluidos
- `CreacionDeBDyTablas.sql` - Crear estructura
- `EjemplosTablas.sql` - Llenar con datos de prueba

### Respaldos
```bash
# MySQL
mysqldump -u root -p marcas_verificacion > backup.sql

# Restaurar
mysql -u root -p marcas_verificacion < backup.sql
```
---

## 🎓 Aprendizaje

Este proyecto es ideal para aprender:
- ✅ Arquitectura cliente-servidor
- ✅ API REST con Node.js/Express
- ✅ Autenticación y autorización
- ✅ HTML/CSS/JavaScript moderno
- ✅ Diseño responsivo con Bootstrap
- ✅ SQL y bases de datos relacionales
- ✅ Control de versiones con Git

---

## 📝 Scripts Útiles

```bash
# Backend
cd Backend
npm install              # Instalar dependencias
node server.js          # Iniciar servidor
npm update              # Actualizar paquetes

# Base de datos
# Ejecutar en MySQL o SQL Server:
# Backend/BD/CreacionDeBDyTablas.sql
# Backend/BD/EjemplosTablas.sql
```

---

## 🚀 Despliegue

### En Localhost (Desarrollo)
```bash
node server.js
# Acceder a http://localhost:3000
```
---

## 👥 Contribuidores

- **Juan S Pérez** - Desarrollador principal

---

## 📌 Estado del proyecto

El proyecto se encuentra en desarrollo activo y puede ser utilizado como base para:

---
