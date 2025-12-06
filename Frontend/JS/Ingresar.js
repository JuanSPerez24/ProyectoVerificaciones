import API_URL from './config.js';

const BotonLogin = document.getElementById("ButtonIngreso");

BotonLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  const Correo = document.getElementById("InputUser").value;
  const password = document.getElementById("InputPassword").value;

  try {
    const resultado = await fetch(`${API_URL}/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Correo, password })
    });

    const data = await resultado.json();

    if (resultado.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem("usuario", JSON.stringify(data));
      window.location.href = "/HTML/RegistroYconsulta.html";
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error en la conexión:", error);
    alert("No se pudo conectar con el servidor");
  }

});
