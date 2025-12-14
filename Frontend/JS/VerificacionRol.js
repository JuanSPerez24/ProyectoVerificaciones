const VerUsuario = document.getElementById("ListaPantallas");


document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    //console.log(usuario);
    if (!usuario.Rol) {
        CerrarSesion();
    }

    if (usuario.Rol === 1) {
        VerUsuario.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" href="/HTML/Usuarios.html" id="">
            Usuarios
            </a>
        </li>
        `;
    }

})