const BotonLogin = document.getElementById("ButtonIngreso");
  
BotonLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  const Correo = document.getElementById("InputUser").value;
  const password = document.getElementById("InputPassword").value;

  try {
    const resultado = await fetch("http://localhost:3000/api/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Correo, password })
    });

    const data = await resultado.json();

    if (resultado.ok) {
      localStorage.setItem("usuario", JSON.stringify(data));
      window.location.href = "/Frontend/HTML/RegistroYconsulta.html";
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error en la conexión:", error);
    alert("No se pudo conectar con el servidor");
  }
  
});





