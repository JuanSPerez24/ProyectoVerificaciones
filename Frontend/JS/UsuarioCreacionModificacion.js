
const TablaUsuarios = document.getElementById('CuerpoTablaUsuarios');
const BodyUsuarios = document.getElementById('BodyUsuarios');
const ButtonRegistroUsuario = document.getElementById('ButtonRegistroNuevoUsuario');

const ModalModificacionDatosHtml = `
  <div class="modal fade" id="ModalModificacionDatos" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Modificar Usuario</h5>
          <button type="button" class="btn-close" id="CerrarModal" ></button>
        </div>
        <div class="modal-body">
          <form>
            <label>Nombre informador:</label>
            <input type="text" id="InputNombreInformadorModal" class="form-control mb-2">
            <label>Correo</label>
            <input type="text" id="InputCorreoModal" class="form-control mb-2">
            <label>Rol</label>
            <select id="SelectNombreRolModal" class="form-select mb-2"> </select>
            <label>Tipo Documento</label>
            <select id="SelectTipoDocumentoModal" class="form-select for vm-select mb-2"> </select>
            <label>Numero documento</label>
            <input type="text" id="InputNumeroDocumentoModal" class="form-control mb-2">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="BtnGuardarCambios">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
`;

const ModalCambioPasswordHtml = `
  <div class="modal fade" id="ModalCambioPassword" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Modificar contraseña</h5>
          <button type="button" class="btn-close" id="CerrarModal" ></button>
        </div>
        <div class="modal-body">
          <form>
            <label>Nueva contraseña:</label>
            <input type="password" id="InputPasswordNuevaModal" autocomplete="new-password" class="form-control mb-2">
            <label>Confirmación contraseña:</label>
            <input type="password" id="InputPasswordConfirmacionModal" autocomplete="new-password" class="form-control mb-2">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="BtnGuardarNewPassword">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
`;

const ModalRegistroUsuarioHtml = `
  <div class="modal fade" id="ModalRegistroUsuario" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Modificar Usuario</h5>
          <button type="button" class="btn-close" id="CerrarModal" ></button>
        </div>
        <div class="modal-body">
          <form>
            <label>Nombre informador:</label>
            <input type="text" id="InputNombreInformadorModal" class="form-control mb-2">
            <label>Correo</label>
            <input type="text" id="InputCorreoModal" class="form-control mb-2">
            <label>Rol</label>
            <select id="SelectNombreRolModal" class="form-select mb-2"> </select>
            <label>Tipo Documento</label>
            <select id="SelectTipoDocumentoModal" class="form-select for vm-select mb-2"> </select>
            <slabel>Numero documento</label>
            <input type="text" id="InputNumeroDocumentoModal" class="form-control mb-2">
            <label>Contraseña:</label>
            <input type="password" id="InputPasswordNuevaModal" autocomplete="new-password" class="form-control mb-2">
            <label>Confirmación contraseña:</label>
            <input type="password" id="InputPasswordConfirmacionModal" autocomplete="new-password" class="form-control mb-2">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="BtnRegistrarUsuario">Registrar</button>
        </div>
      </div>
    </div>
  </div>
`;

//Cerrar Modal y eliminar
function CerrarModal(ModalElement, Modal) {
  //Cerrar modal
  document.activeElement.blur();
  Modal.hide();
  //Eliminar modal
  ModalElement.remove();
}

//Crear un nuevo usuario
ButtonRegistroUsuario.addEventListener('click', async (e) => {

  e.preventDefault();

  BodyUsuarios.insertAdjacentHTML('beforeend', ModalRegistroUsuarioHtml);

  await Promise.resolve();

  const InputNombreInformadorModal = document.getElementById('InputNombreInformadorModal');
  const InputCorreoModal = document.getElementById('InputCorreoModal');
  const SelectNombreRolModal = document.getElementById('SelectNombreRolModal');
  const SelectTipoDocumentoModal = document.getElementById("SelectTipoDocumentoModal");
  const InputNumeroDocumentoModal = document.getElementById('InputNumeroDocumentoModal');
  const Password = document.getElementById('InputPasswordNuevaModal');
  const PasswordConfirmacion = document.getElementById('InputPasswordConfirmacionModal');
  const ButtonnRegistrarUsuario = document.getElementById('BtnRegistrarUsuario');
  const ButtonCerrarModal = document.getElementById('CerrarModal');

  const ModalElement = document.getElementById('ModalRegistroUsuario');
  const ModalRegistroUsuario = new bootstrap.Modal(ModalElement);

  //Llenar selects modal
  await LlenarSelect('http://localhost:3000/api/TipoDeDocumento', SelectTipoDocumentoModal, 'IdTipoDocumento', 'SiglaTipoDocumento', 'Seleccione un tipo de documento');
  await LlenarSelect('http://localhost:3000/api/Roles', SelectNombreRolModal, 'IdRol', 'NombreRol', 'Seleccione un rol');

  ModalRegistroUsuario.show();

  //Cerrar Modal actual
  ButtonCerrarModal.addEventListener('click', (e) => {
    e.preventDefault();
    CerrarModal(ModalElement, ModalRegistroUsuario);
  })

  ButtonnRegistrarUsuario.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!InputNombreInformadorModal.value || !InputCorreoModal.value || !SelectNombreRolModal.value || !SelectTipoDocumentoModal.value || !InputNumeroDocumentoModal.value || !Password.value || !PasswordConfirmacion.value) {
      return alert('Faltan campos obligatorios.');
    }

    if (Password.value != PasswordConfirmacion.value) {
      return alert("Las contraseñas no coinciden.");
    }

    console.log({
      NombreInformador: InputNombreInformadorModal.value,
      Correo: InputCorreoModal.value,
      password: Password.value,
      IdTipoDocumento: SelectTipoDocumentoModal.value,
      NumeroDocumento: InputNumeroDocumentoModal.value,
      IdRol: SelectNombreRolModal.value,
    })

    try {
      const DatosUsuario = {
        NombreInformador: InputNombreInformadorModal.value,
        Correo: InputCorreoModal.value,
        password: Password.value,
        IdTipoDocumento: SelectTipoDocumentoModal.value,
        NumeroDocumento: InputNumeroDocumentoModal.value,
        IdRol: SelectNombreRolModal.value,
      };

      const respuesta = await fetch("http://localhost:3000/api/Usuario/Nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DatosUsuario)
      });

      if (!respuesta.ok) {
        CerrarModal(ModalElement, ModalRegistroUsuario);
        return alert("Error al guardar los datos.")
      };

      alert("Usuario creado con éxito");
      CerrarModal(ModalElement, ModalRegistroUsuario);

    } catch (error) {
      alert("Error en la creacion del usuario.")
      CerrarModal(ModalElement, ModalRegistroUsuario);
    };
  });
});

//Llenar selects modal
async function LlenarSelect(url, select, campoValor, campoTexto, TextoInicial) {

  select.innerHTML = `<option value ="">${TextoInicial}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item[campoValor];
      option.textContent = item[campoTexto];
      select.appendChild(option);
    });
  } catch (error) {
    console.log(`Error al cargar${select}`, error);
  };
};

// Función para modificar un usuario
async function ModificarUsuario(NombreInformador, Correo, IdRol, IdTipoDocumento, NumeroDocumento, Id) {
  // Insertar el modal al final del body
  BodyUsuarios.insertAdjacentHTML('beforeend', ModalModificacionDatosHtml);

  await Promise.resolve();

  const ModalElement = document.getElementById('ModalModificacionDatos');
  const ModalModifiacionUsuer = new bootstrap.Modal(ModalElement);

  ModalModifiacionUsuer.show();

  //Inputs y slects de modal
  const InputNombreInformadorModal = document.getElementById('InputNombreInformadorModal');
  const InputCorreoModal = document.getElementById('InputCorreoModal');
  const SelectNombreRolModal = document.getElementById('SelectNombreRolModal');
  const SelectTipoDocumentoModal = document.getElementById("SelectTipoDocumentoModal");
  const InputNumeroDocumentoModal = document.getElementById('InputNumeroDocumentoModal');
  const ButtonCerrarModal = document.getElementById('CerrarModal');

  //Llenar Inputs
  InputNombreInformadorModal.value = NombreInformador;
  InputCorreoModal.value = Correo;
  InputNumeroDocumentoModal.value = NumeroDocumento;

  //Llenar selects modal
  await LlenarSelect('http://localhost:3000/api/TipoDeDocumento', SelectTipoDocumentoModal, 'IdTipoDocumento', 'SiglaTipoDocumento', 'Seleccione un tipo de documento');
  await LlenarSelect('http://localhost:3000/api/Roles', SelectNombreRolModal, 'IdRol', 'NombreRol', 'Seleccione un rol');

  SelectNombreRolModal.value = IdRol;
  SelectTipoDocumentoModal.value = IdTipoDocumento;

  //Cerrar Modal actual
  ButtonCerrarModal.addEventListener('click', (e) => {
    e.preventDefault();
    CerrarModal(ModalElement, ModalModifiacionUsuer);
  })


  // Validación dentro del mismo flujo
  document.getElementById('BtnGuardarCambios').addEventListener('click', async (e) => {
    e.preventDefault();

    if (!InputNombreInformadorModal || !InputCorreoModal || !InputNumeroDocumentoModal || !SelectNombreRolModal || !SelectTipoDocumentoModal) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/Usuario/Mod', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          NombreInformador: InputNombreInformadorModal.value,
          Correo: InputCorreoModal.value,
          RolId: SelectNombreRolModal.value,
          TipoDocumentoId: SelectTipoDocumentoModal.value,
          NumeroDocumento: InputNumeroDocumentoModal.value,
          IdInformador: Id
        })
      });

      const data = await respuesta.json();
      if (!respuesta.ok) {
        alert('Error al modificar el usuario: ' + data.error);
      }

      alert('Usuario modificado exitosamente');
      CerrarModal(ModalElement, ModalModifiacionUsuer);
      cargarUsuarios();

    } catch (error) {
      console.error('Error al modificar el usuario:', error);
    }
  });
};

//Cambio password
async function ModificarPassword(IdUsuario) {

  BodyUsuarios.insertAdjacentHTML('beforeend', ModalCambioPasswordHtml);

  await Promise.resolve();

  const ModalElement = document.getElementById('ModalCambioPassword');
  const ModalCambioPassword = new bootstrap.Modal(ModalElement);

  ModalCambioPassword.show();

  const NewPassword = document.getElementById('InputPasswordNuevaModal');
  const NewPasswordConfirmacion = document.getElementById('InputPasswordConfirmacionModal');
  const ButtonCambioPassword = document.getElementById('BtnGuardarNewPassword');
  const ButtonCerrarModal = document.getElementById('CerrarModal');

  //Cerrar Modal actual
  ButtonCerrarModal.addEventListener('click', (e) => {
    e.preventDefault();
    CerrarModal(ModalElement, ModalCambioPassword);
  })

  ButtonCambioPassword.addEventListener('click', async (e) => {
    e.preventDefault();

    if (NewPassword.value != NewPasswordConfirmacion.value) {
      console.log("Las contraseñas no coinciden.");
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/Usuario/ModPass", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NuevaContraseña: NewPassword.value,
          IdInformador: IdUsuario
        })
      });

      if (!respuesta.ok) {
        alert("No se registro la contraseña correctamente.");
        return;
      }

      alert("Contraseña cambiada con éxito.");
      CerrarModal(ModalElement, ModalCambioPassword);
      IdUsuario = null;

    } catch (error) {
      console.log("Error al registrar la contraseña: ", error);
      alert("No se pudo guardar la nueva contraseña.")
      IdUsuario = null;
    }

  });

}

// Cargar los usuarios desde el backend
async function cargarUsuarios() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/Usuarios');
    const data = await respuesta.json();

    // console.log("Datos recibidos:", data);

    // Aseguramos que siempre haya un array
    const usuarios = Array.isArray(data) ? data : data?.datos || [];

    //console.log("Usuarios cargados: lo que se pasa mod", usuarios);

    // Limpiar tabla
    TablaUsuarios.innerHTML = '';

    // Crear filas HTML
    const filasHTML = usuarios.map(u => `
      <tr>
        <td>${u.NombreInformador || ''}</td>
        <td>${u.Correo || ''}</td>
        <td>${u.NombreRol || ''}</td>
        <td>${u.SiglaTipoDocumento || ''}</td>
        <td>${u.NumeroDocumento || ''}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="ModificarUsuario('${u.NombreInformador}','${u.Correo}',${u.RolId},${u.TipoDocumentoId},'${u.NumeroDocumento}',${u.IdInformador})">Modificar</button>
          <button class="btn btn-primary btn-sm" onclick="ModificarPassword(${u.IdInformador})" >Cambiar password</button>
        </td>
      </tr>
    `).join('');

    // Insertar filas
    TablaUsuarios.innerHTML = filasHTML;


  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
  }
}

// Cargar los usuarios cuando se cargue la página
window.addEventListener('load', cargarUsuarios);
