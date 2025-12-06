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
✅ **Carga de documentos** con validación  
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
├── MANUAL_DE_USUARIO.md              # Guía completa para usuarios
├── MANUAL_ADMINISTRADOR.md           # Guía para administradores
├── GUIA_RAPIDA.md                    # Referencia rápida
├── GUIA_INSTALACION.md               # Instrucciones de instalación
├── API_DOCUMENTATION.md              # Documentación de endpoints
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

## 📖 Documentación

### Para Usuarios Finales
📘 **[MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md)** - Guía completa con:
- Instrucciones paso a paso para cada módulo
- Screenshots y ejemplos
- Preguntas frecuentes
- Solución de problemas básicos

### Para Administradores
👨‍💼 **[MANUAL_ADMINISTRADOR.md](./MANUAL_ADMINISTRADOR.md)** - Todo sobre:
- Gestión de usuarios y roles
- Mantenimiento de base de datos
- Respaldos y recuperación
- Seguridad y auditoría
- Solución de problemas avanzados

### Referencia Rápida
⚡ **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** - Checklists y tablas para:
- Acceso rápido a funciones
- Problemas comunes
- Checklist diario/semanal/mensual

### Instalación y Configuración
🔧 **[GUIA_INSTALACION.md](./GUIA_INSTALACION.md)** - Detalles técnicos:
- Requisitos del sistema
- Paso a paso de instalación
- Configuración de entorno
- Solución de problemas de instalación

### Documentación de API
🔌 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Para desarrolladores:
- Todos los endpoints
- Ejemplos de uso con curl/JavaScript
- Códigos de error
- Testing con Postman

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
- 🔐 Control de acceso basado en roles (RBAC)
- 📝 Validación de entrada en todos los formularios
- 🛡️ CORS habilitado para desarrollo
- 📋 Logs de auditoría en BD

**Recomendaciones para Producción:**
- Implementar HTTPS con certificado SSL
- Usar JWT para autenticación stateless
- Agregar 2FA (autenticación de dos factores)
- Encriptar datos sensibles en BD
- Implementar rate limiting

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

## 🐛 Solución de Problemas Comunes

**Puerto 3000 en uso:**
```bash
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

**BD no conecta:**
1. Verificar que servicio de BD está activo
2. Revisar credenciales en `Backend/db.js`
3. Ejecutar script de creación

**Página en blanco después de login:**
1. Abrir DevTools (F12)
2. Revisar Console por errores
3. Limpiar cache (Ctrl + Shift + Delete)

**Más problemas:**
Ver [GUIA_INSTALACION.md](./GUIA_INSTALACION.md#solución-de-problemas-de-instalación)

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

### En Producción
1. Cambiar variables de entorno (.env)
2. Usar HTTPS (certificado SSL)
3. Restrictar CORS a dominio específico
4. Implementar autenticación JWT
5. Aumentar logs y monitoreo
6. Configurar respaldos automáticos

---

## 👥 Contribuidores

- **Juan S Pérez** - Desarrollador principal

---

## 📄 Licencia

Proyecto educativo - Todos los derechos reservados © 2025

---

## 📞 Soporte

**¿Necesitas ayuda?**

1. 📖 Consulta la documentación relevante:
   - Usuarios → [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md)
   - Admin → [MANUAL_ADMINISTRADOR.md](./MANUAL_ADMINISTRADOR.md)
   - Instalación → [GUIA_INSTALACION.md](./GUIA_INSTALACION.md)
   - API → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

2. ⚡ Consulta [GUIA_RAPIDA.md](./GUIA_RAPIDA.md) para referencia rápida

3. 🐛 Contacta al administrador del sistema

---

## 🎯 Roadmap Futuro

- [ ] Implementar JWT para autenticación
- [ ] Agregar paginación en búsquedas
- [ ] Crear módulo de reportes con gráficos
- [ ] Implementar 2FA
- [ ] API versioning (v2)
- [ ] Interfaz de administración mejorada
- [ ] Integración con servicios externos
- [ ] App móvil

---

**Sistema de Gestión de Marcas en Verificación**  
*Versión 1.0 - Diciembre 2025*  
*Desarrollado por Juan S Pérez*

Ubicados en:

```
Backend/BD/
```

---

## 📌 Estado del proyecto

El proyecto se encuentra en desarrollo activo y puede ser utilizado como base para:

---