const BotonCerrarSesion = document.getElementById("ButtonCerrarSesion");

function CerrarSesion() {
    // borrar datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // notificar a otras pestañas
    localStorage.setItem("logout", Date.now());

    window.location.href = "/";
}

// botón manual
if (BotonCerrarSesion) {
    BotonCerrarSesion.addEventListener("click", () => {
        CerrarSesion();
    });
}

// si no hay token o usuario, redirigir
function CierreSesionSinInicio() {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    
    if (!token || !usuario) {
        window.location.href = "/";
    }
}

CierreSesionSinInicio();

// Sincrizacion entre pestañas
window.addEventListener("storage", (event) => {
    // si otra pestaña cerró sesión
    if (event.key === "logout") {
        window.location.href = "/";
    }
});

let timeout;

function ResetInactividad() {
    // Reinicia el contador
    clearTimeout(timeout);

    // Programa el cierre dentro de 20 min
    timeout = setTimeout(() => {

        // Acción al expirar
        CerrarSesion();
        
    }, 20 * 60 * 1000); // 20 minutos. Minutos, segundos, milisegundos
}

// Eventos que indican actividad
document.addEventListener("mousemove", ResetInactividad);
document.addEventListener("keydown", ResetInactividad);
document.addEventListener("click", ResetInactividad);

// Inicia el contador cuando carga la página
ResetInactividad();
