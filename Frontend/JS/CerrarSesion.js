
const BotonCerrarSesion = document.getElementById("ButtonCerrarSesion");

function CerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/Frontend/index.html";
}

BotonCerrarSesion.addEventListener("click", () => {
    CerrarSesion();
});
