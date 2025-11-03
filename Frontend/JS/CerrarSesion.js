const BotonCerrarSesion = document.getElementById("ButtonCerrarSesion");

BotonCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "/Frontend/index.html";
});

