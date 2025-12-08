
const BotonCerrarSesion = document.getElementById("ButtonCerrarSesion");

function CerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
}

BotonCerrarSesion.addEventListener("click", () => {
    CerrarSesion();
});

function CierreSesionSinInicio() {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    
    if (!token || !usuario) {
        window.location.href = "/";
    }
};

CierreSesionSinInicio();
