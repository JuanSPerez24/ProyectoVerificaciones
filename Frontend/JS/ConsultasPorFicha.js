import API_URL from './config.js';
//Botones de registro consulta y limpiar
const ButtonConsultar = document.getElementById("ButtonConsultar");
const ButtonRegistrarPrimeraEtapa = document.getElementById("ButtonRegistrarPrimeraEtapa");
const ButtonRegistrarTerceraEtapa = document.getElementById("ButtonRegistrarTerceraEtapa");
const ButtonRegistarSegundaEtapa = document.getElementById("ButtonRegistrarSegundaEtapa");

//Campos Primera etapa
const Ficha = document.getElementById("TextFichaPrimeraEtapa");
const Fecha = document.getElementById("FechaPrimeraEtapa");
const Hogar = document.getElementById("SelectHogar");
const Orden = document.getElementById("SelectOrden");
const TipoDocumento = document.getElementById("SelectTipoDocumentoPrimeraEtapa");
const NumeroDocumento = document.getElementById("InputNumeroDocumento");
const Celular = document.getElementById("InputCelular");
const Correo = document.getElementById("InputCorreo");
const Informador = document.getElementById("SelectInformadorPrimeraEtapa");
const PuntoAtencion = document.getElementById("SelectPuntoAtencion");
const Codigo = document.getElementById("SelectCodigoVerificacion");
const SelectTipologia1 = document.getElementById("SelectTipologia1");
const SelectTipologia2 = document.getElementById("SelectTipologia2");
const SelectTipologia3 = document.getElementById("SelectTipologia3");
const DescripcionPrimeraEtapa = document.getElementById("InputDescripcionPrimeraEtapa");

//Campos Segunda Etapa
const Levantamiento = document.getElementById("SelectRespuestaLevantamiento");
const FechaSegundaEtapa = document.getElementById("InputFechaSegundaEtapa");
const DescripcionSegundaEtapa = document.getElementById("InputDescripcionSegundaEtapa");

//Campos tercera etapa
const DocumentosEnPunto = document.getElementById("SelectDocumentosEnPunto");
const FechaTerceraEtapa = document.getElementById("InputFechaTerceraEtapa");
const TramiteRealizado = document.getElementById("SelectTramiteRealizado");
const InformadorTerceraEtapa = document.getElementById("SelectInformadorTerceraEtapa");
const IdRespuesta = document.getElementById("InputIdRespuesta");
const FichaTerceraEtapa = document.getElementById("InputFichaTerceraEtapa");
const HogarTerceraEtapa = document.getElementById("SelectHogarTerceraEtapa");
const OrdenTerceraEtapa = document.getElementById("SelectOrdenTerceraEtapa");
const TipoDocumentoTerceraEtapa = document.getElementById("SelectTipoDocumentoTerceraEtapa");
const NumeroDocumentoTerceraEtapa = document.getElementById("InputNumeroDocumentoTerceraEtapa");
const DescripcionTerceraEtapa = document.getElementById("InputDescripcionTerceraEtapa");

//Etapas formularios
const FormPrimeraEtapa = document.getElementById("RadioPrimeraEtapa");
const FormSegundaEtapa = document.getElementById("RadioSegundaEtapa");
const FormTerceraEtapa = document.getElementById("RadioTerceraEtapa");

//Constantes campos primera seguna y tercera etapa
const CamposPrimeraEtapa = [Fecha, Hogar, Orden, TipoDocumento, NumeroDocumento, Celular, Correo, PuntoAtencion, Codigo, SelectTipologia1, SelectTipologia2, SelectTipologia3, DescripcionPrimeraEtapa];
const CamposSegundaEtapa = [Levantamiento, FechaSegundaEtapa, DescripcionSegundaEtapa];
const CamposTerceraEtapa = [DocumentosEnPunto, FechaTerceraEtapa, TramiteRealizado, IdRespuesta, FichaTerceraEtapa, HogarTerceraEtapa, OrdenTerceraEtapa, TipoDocumentoTerceraEtapa, NumeroDocumentoTerceraEtapa, DescripcionTerceraEtapa];

//Variables
let LLenarDatos = [];
let ArrayDeshabilitar = [];
let ArrayHabilitar = [];
let IdSolicitud = null;

//Llenar selects de informadores
LlenarSelect(`${API_URL}/Usuarios`, Informador, "IdInformador", "NombreInformador", "Seleccione Iinformador")
LlenarSelect(`${API_URL}/Usuarios`, InformadorTerceraEtapa, "IdInformador", "NombreInformador", "Seleccione Iinformador")

//Llenar informador con el usuario logeado
const usuario = JSON.parse(localStorage.getItem("usuario"));
Informador.textContent = String(usuario.id);
Informador.disabled = true;
InformadorTerceraEtapa.textContent = String(usuario.id);
InformadorTerceraEtapa.disabled = true;

// Bucar solicitud
ButtonConsultar.addEventListener("click", async (e) => {
    e.preventDefault();

    const fichaValor = Ficha.value.trim();

    if (!fichaValor) {
        alert("Por favor ingrese una ficha para consultar.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/verificaciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Ficha: fichaValor })
        });

        const data = await respuesta.json();

        // Verificar si la respuesta fue exitosa
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                alert("No se encontró ninguna solicitud con esa ficha.");
                Fecha.value = formatearFechaParaInput(new Date());
                ArrayDeshabilitar.push(FormSegundaEtapa, FormTerceraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrayHabilitar.push(FormPrimeraEtapa, ButtonRegistrarPrimeraEtapa);
                HabilitarCampos(ArrayHabilitar);
            } else {
                alert("Error al realizar la búsqueda.");
            }
            return;
        }

        const registro = Array.isArray(data) ? data[0] : data;

        IdSolicitud = registro.IdSolicitud;
        console.log("Solicitud encontrada:", IdSolicitud);

        //Valores para llenar los campos
        const ValoresPrimeraEtapa = [registro.FechaPrimeraEtapa, registro.Hogar, registro.Orden, registro.TipoDocumentoId, registro.NumeroDocumento, registro.Celular, registro.Correo, registro.InformadorPrimeraEtapaId, registro.PuntoAtencionId, registro.VerificacionId, registro.id_tp1, registro.id_tp2, registro.id_tp3, registro.DescripcionPrimerEtapa];
        const ValoresSegundaEtapa = [registro.Levantamiento, registro.FechaSegundaEtapa, registro.DescripcionSegundaEtapa];
        const ValoresTerceraEtapa = [registro.DocumentosEnPunto, registro.FechaTerceraEtapa, registro.TramiteId, registro.InformadorTerceraEtapaId, registro.IdRespuesta, registro.FichaTerceraEtapa, registro.HogarTercera, registro.OrdenTercera, registro.TipoDocumentoIdTercera, registro.NumeroDocumentoTercera, registro.DescripcionTerceraEtapa];

        //Solo primera etapa
        if (registro.FechaPrimeraEtapa && !registro.FechaSegundaEtapa) {
            LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
            LlenarCampos(LLenarDatos);

            //Si es admin se habilia la segunda etapa para que realice el registro
            if (usuario.Rol === 1) {
                ArrayDeshabilitar.push(CamposPrimeraEtapa, FormTerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrayHabilitar.push(ButtonRegistarSegundaEtapa, FormSegundaEtapa);
                HabilitarCampos(ArrayHabilitar);
                FechaSegundaEtapa.value = formatearFechaParaInput(new Date());
                alert("La solicitud se encuentra pendiente de respuesta.");
                return;
            }

            //Si NO es admin no se muestra la segunda etapa
            ArrayDeshabilitar.push(CamposPrimeraEtapa, FormSegundaEtapa, FormTerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            alert("La solicitud se encuentra pendiente de respuesta.");
            return;

        };

        //Solo segunda etapa
        if (registro.FechaSegundaEtapa && !registro.FechaTerceraEtapa) {


            if (registro.Levantamiento === "0" || registro.Levantamiento === 0) {
                alert("La solicitud no requiere tercera etapa, proceso finalizado.");


                const RegistrarOtraSolicitud = confirm("Desea registrar una nueva solicitud con esta ficha.");

                if (RegistrarOtraSolicitud){
                    ArrayDeshabilitar.push(CamposSegundaEtapa, CamposTerceraEtapa, Ficha, FormSegundaEtapa, FormTerceraEtapa, ButtonRegistrarTerceraEtapa);
                    DeshabilitarCampos(ArrayDeshabilitar);
                    ArrayHabilitar.push(CamposPrimeraEtapa, ButtonRegistrarPrimeraEtapa);
                    HabilitarCampos(ArrayHabilitar);

                    return;
                };

                LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
                LlenarCampos(LLenarDatos);

                LLenarDatos = [CamposSegundaEtapa, ValoresSegundaEtapa];
                LlenarCampos(LLenarDatos);

                ArrayDeshabilitar.push(CamposPrimeraEtapa, FormTerceraEtapa, Ficha, CamposSegundaEtapa, ButtonRegistrarPrimeraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrayHabilitar.push(FormSegundaEtapa);
                HabilitarCampos(ArrayHabilitar);
                return;
            }

            ArrayDeshabilitar.push(CamposPrimeraEtapa, CamposSegundaEtapa, Ficha, ButtonRegistrarPrimeraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            ArrayHabilitar.push(FormSegundaEtapa, FormTerceraEtapa, ButtonRegistrarTerceraEtapa, CamposTerceraEtapa);
            HabilitarCampos(ArrayHabilitar);

            FechaTerceraEtapa.value = formatearFechaParaInput(new Date());

            alert("Registro de segunda etapa completo, registrar tercera etapa.");

            return;
        }

        //Tercera etapa completa
        if (registro.FechaTerceraEtapa) {

            const VerDatos = confirm("La solicitud ya cuenta con las tres etapas registradas, ¿desea ver los datos?");


            
            if (VerDatos) {
                ArrayDeshabilitar.push(CamposPrimeraEtapa, CamposSegundaEtapa, CamposTerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa, ButtonRegistrarTerceraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrayHabilitar.push(FormPrimeraEtapa, FormSegundaEtapa, FormTerceraEtapa);
                HabilitarCampos(ArrayHabilitar);
                LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
                LlenarCampos(LLenarDatos);

                LLenarDatos = [CamposSegundaEtapa, ValoresSegundaEtapa];
                LlenarCampos(LLenarDatos);

                LLenarDatos = [CamposTerceraEtapa, ValoresTerceraEtapa];
                LlenarCampos(LLenarDatos);
                return;
            }

            const RegistrarOtraSolicitud = confirm("Desea registrar una nueva solicitud con esta ficha.");

            if (RegistrarOtraSolicitud){
                ArrayDeshabilitar.push(CamposSegundaEtapa, CamposTerceraEtapa, Ficha, FormSegundaEtapa, FormTerceraEtapa, ButtonRegistrarTerceraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrayHabilitar.push(CamposPrimeraEtapa, ButtonRegistrarPrimeraEtapa);
                HabilitarCampos(ArrayHabilitar);

                return;
            };
            
            ArrayDeshabilitar.push(FormPrimeraEtapa,FormSegundaEtapa, FormTerceraEtapa, CamposPrimeraEtapa, CamposSegundaEtapa, CamposTerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa, ButtonRegistrarTerceraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            return;

        }

    } catch (error) {
        console.error("Error al consultar la ficha:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

//Formateo de fechas
function formatearFechaParaInput(fechaISO) {
    if (!fechaISO) return " ";

    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
}

//Llenar campos con la busqueda encontrada
function LlenarCampos(Arreglo) {
    const campos = Arreglo[0];
    const valores = Arreglo[1];

    campos.forEach((campo, index) => {
        if (campo.type === "date") {
            campo.value = formatearFechaParaInput(valores[index]);
            return;
        }
        campo.value = valores[index] === null ? "" : valores[index];
    });
    LLenarDatos = [];
}

// Deshabilitar campos
function DeshabilitarCampos(ArrayCampos = []) {

    const Campos = ArrayCampos.flat();

    Campos.forEach((campo) => {
        campo.disabled = true;
    });
    ArrayDeshabilitar = [];
}

//Habilitar campos
function HabilitarCampos(ArrayCampos = []) {

    const Campos = ArrayCampos.flat();

    Campos.forEach((campo) => {
        campo.disabled = false;
    });

    ArrayDeshabilitar = [];
}

//Creacion Solicitud Primera Etapa
ButtonRegistrarPrimeraEtapa.addEventListener("click", async (e) => {
    e.preventDefault();
    //Validacion campos obligatorios
    for (let i = 0; i < CamposPrimeraEtapa.length; i++) {
        if (!CamposPrimeraEtapa[i].value) {
            alert("Por favor complete todos los campos obligatorios de la primera etapa.");
            return;
        }
    }

    //Construccion del objeto de datos
    const datosPrimeraEtapa = {
        FechaPrimeraEtapa: Fecha.value,
        Ficha: Ficha.value.trim(),
        informadorPrimeraEtapaId: Informador.value,
        PuntoAtencionId: PuntoAtencion.value,
        VerificacionId: Codigo.value,
        DescripcionPrimerEtapa: DescripcionPrimeraEtapa.value.trim(),
        TipoDocumentoId: TipoDocumento.value,
        NumeroDocumentoSolicitante: NumeroDocumento.value.trim(),
        Correo: Correo.value.trim(),
        Celular: Celular.value.trim(),
        Hogar: Hogar.value,
        Orden: Orden.value,
        Tipologias: [SelectTipologia1.value, SelectTipologia2.value, SelectTipologia3.value].filter(t => t)
    };

    try {
        const respuesta = await fetch(`${API_URL}/verificaciones/solicitudes`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPrimeraEtapa)
        });
        if (respuesta.ok) {
            alert("Primera etapa registrada con éxito.");

            ArrayDeshabilitar.push(CamposPrimeraEtapa, Ficha, ButtonRegistrarPrimeraEtapa, FormSegundaEtapa, FormTerceraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);

            return;
        } else {
            alert("Error al registrar la primera etapa.");
        }
    } catch (error) {
        console.error("Error al registrar la primera etapa:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

//Registro Segunda Etapa
ButtonRegistarSegundaEtapa.addEventListener("click", async (e) => {
    e.preventDefault();
    for (let i = 0; i < CamposSegundaEtapa.length; i++) {
        if (!CamposSegundaEtapa[i].value) {
            alert("Digite los campos completos para el registro de esta etapa.");
            return;
        };
    };
    const datosSegundaEtapa = {
        IdSolicitud: IdSolicitud,
        FechaSegundaEtapa: FechaSegundaEtapa.value.trim(),
        Levantamiento: Levantamiento.value,
        DescripcionSegundaEtapa: DescripcionSegundaEtapa.value
    };
    try {
        const respuesta = await fetch(`${API_URL}/verificaciones/SegundaEtapa`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosSegundaEtapa)
        });

        if (respuesta.ok) {
            alert("Segunda etapa registrada con exito.");
            ArrayDeshabilitar.push(CamposPrimeraEtapa, CamposSegundaEtapa, CamposTerceraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            IdSolicitud = null;
            return;
        } else {
            alert("Error al registrar segunda etapa.");
        };
        IdSolicitud = null;
    } catch (error) {
        console.log("Error al registrar la segunda etapa: ", error);
        alert("No se pudo registrar la segunda etapa");
        IdSolicitud = null;
    }
});

//Registro Tercera Etapa
ButtonRegistrarTerceraEtapa.addEventListener("click", async (e) => {
    e.preventDefault();
    //Validacion campos obligatorios
    for (let i = 0; i < CamposTerceraEtapa.length; i++) {
        if (!CamposTerceraEtapa[i].value) {
            alert("Por favor complete todos los campos obligatorios de la tercera etapa.");
            return;
        }
    }

    const datosTerceraEtapa = {
        IdSolicitud: IdSolicitud,
        FechaTerceraEtapa: FechaTerceraEtapa.value.trim(),
        DocumentosEnPunto: DocumentosEnPunto.value,
        TramiteId: TramiteRealizado.value,
        InformadorTerceraEtapaId: InformadorTerceraEtapa.value,
        IdRespuesta: IdRespuesta.value.trim(),
        FichaTerceraEtapa: FichaTerceraEtapa.value.trim(),
        DescripcionTerceraEtapa: DescripcionTerceraEtapa.value.trim(),
        TipoDocumentoId: TipoDocumentoTerceraEtapa.value,
        NumeroDocumentoSolicitante: NumeroDocumentoTerceraEtapa.value.trim(),
        Hogar: HogarTerceraEtapa.value,
        Orden: OrdenTerceraEtapa.value
    };
    try {
        const respuesta = await fetch(`${API_URL}/verificaciones/TerceraEtapa`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosTerceraEtapa)
        });
        if (respuesta.ok) {
            alert("Tercera etapa registrada con éxito.");
            ArrayDeshabilitar.push(CamposTerceraEtapa, ButtonRegistrarTerceraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            IdSolicitud = null;
            return;
        } else {
            alert("Error al registrar la tercera etapa.");
        };
        IdSolicitud = null;
    } catch (error) {
        console.error("Error al registrar la tercera etapa:", error);
        alert("No se pudo conectar con el servidor.");
        IdSolicitud = null;
    }
});

//Llenar selects
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

//Lenar selects de Tipos de documento
LlenarSelect(`${API_URL}/TipoDeDocumento`, TipoDocumento, "IdTipoDocumento", "SiglaTipoDocumento", "Seleccione tipo documento")
LlenarSelect(`${API_URL}/TipoDeDocumento`, TipoDocumentoTerceraEtapa, "IdTipoDocumento", "SiglaTipoDocumento", "Seleccione tipo documento")

//Llenar selects de puntsod e atencion
LlenarSelect(`${API_URL}/PuntosDeAtencion`, PuntoAtencion, "IdPuntoAtencion", "NombrePuntoAtencion", "Seleccione punto atención")

//Lenar selects de codigos verificaciones
LlenarSelect(`${API_URL}/CodigosVerificaciones`, Codigo, "IdVerificaciones", "DescripcionVerificacion", "Seleccione verificación")

//Llenar selects de tramite de tercera etapa
LlenarSelect(`${API_URL}/Tramites`, TramiteRealizado, "IdTramite", "NombreTramite", "Seleccione tramite realizado")

//Lenar selects de tipologias
LlenarSelect(`${API_URL}/Tipologias`, SelectTipologia1, "IdTipologia", "NombreTramite", "Seleccione tipologia 1")
LlenarSelect(`${API_URL}/Tipologias`, SelectTipologia2, "IdTipologia", "NombreTramite", "Seleccione tipologia 2")
LlenarSelect(`${API_URL}/Tipologias`, SelectTipologia3, "IdTipologia", "NombreTramite", "Seleccione tipologia 3")

