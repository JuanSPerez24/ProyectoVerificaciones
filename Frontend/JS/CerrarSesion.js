
const BotonCerrarSesion = document.getElementById("ButtonCerrarSesion");

function CerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
}

BotonCerrarSesion.addEventListener("click", () => {
    CerrarSesion();
});
