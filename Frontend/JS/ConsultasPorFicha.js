//Botones de registro consulta y limpiar
const ButtonConsultar = document.getElementById("ButtonConsultar");
const ButtonRegistrarPrimeraEtapa = document.getElementById("ButtonRegistrarPrimeraEtapa");
const ButtonRegistrarTerceraEtapa = document.getElementById("ButtonRegistrarTerceraEtapa");

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
const levantamiento = document.getElementById("SelectRespuestaLevantamiento");
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
const PrimeraEtapa = document.getElementById("RadioPrimeraEtapa");
const SegundaEtapa = document.getElementById("RadioSegundaEtapa");
const TerceraEtapa = document.getElementById("RadioTerceraEtapa");

//Constantes campos primera seguna y tercera etapa
const CamposPrimeraEtapa = [Fecha, Hogar, Orden, TipoDocumento, NumeroDocumento, Celular, Correo, Informador, PuntoAtencion, Codigo, SelectTipologia1, SelectTipologia2, SelectTipologia3, DescripcionPrimeraEtapa];
const CamposSegundaEtapa = [levantamiento, FechaSegundaEtapa, DescripcionSegundaEtapa];
const CamposTerceraEtapa = [DocumentosEnPunto, FechaTerceraEtapa, TramiteRealizado, InformadorTerceraEtapa, IdRespuesta, FichaTerceraEtapa, HogarTerceraEtapa, OrdenTerceraEtapa, TipoDocumentoTerceraEtapa, NumeroDocumentoTerceraEtapa, DescripcionTerceraEtapa];

//Variables
let LLenarDatos = [];
let ArrayDeshabilitar = [];
let ArrarHabilitar = [];

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
        const respuesta = await fetch("http://localhost:3000/api/verificaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Ficha: fichaValor })
        });

        const data = await respuesta.json();

        // Verificar si la respuesta fue exitosa
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                alert("No se encontró ninguna solicitud con esa ficha.");
                FechaPrimeraEtapa.value = formatearFechaParaInput(new Date());
                ArrayDeshabilitar.push(SegundaEtapa, TerceraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrarHabilitar.push(PrimeraEtapa, ButtonRegistrarPrimeraEtapa);
                HabilitarCampos(ArrarHabilitar);
            } else {
                alert("Error al realizar la búsqueda.");
            }
            return;
        }

        const registro = Array.isArray(data) ? data[0] : data;

        const ValoresPrimeraEtapa = [registro.FechaPrimeraEtapa, registro.Hogar, registro.Orden, registro.TipoDocumentoId, registro.NumeroDocumento, registro.Celular, registro.Correo, registro.InformadorPrimeraEtapaId, registro.PuntoAtencionId, registro.VerificacionId, registro.id_tp1, registro.id_tp2, registro.id_tp3, registro.DescripcionPrimerEtapa];
        const ValoresSegundaEtapa = [registro.Levantamiento, registro.FechaSegundaEtapa, registro.DescripcionSegundaEtapa];
        const ValoresTerceraEtapa = [registro.DocumentosEnPunto, registro.FechaTerceraEtapa, registro.TramiteId, registro.InformadorTerceraEtapaId, registro.IdRespuesta, registro.FichaTerceraEtapa, registro.HogarTercera, registro.OrdenTercera, registro.TipoDocumentoIdTercera, registro.NumeroDocumentoTercera, registro.DescripcionTerceraEtapa];

        //Solo primera etapa
        if (registro.FechaPrimeraEtapa && !registro.FechaSegundaEtapa) {
            LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
            LlenarCampos(LLenarDatos);

            ArrayDeshabilitar.push(CamposPrimeraEtapa, SegundaEtapa, TerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);

            alert("La solicitud se encuentra pendiente de respuesta.");
            return;
        }

        //Solo segunda etapa
        if (registro.FechaSegundaEtapa && !registro.FechaTerceraEtapa) {
            LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
            LlenarCampos(LLenarDatos);

            LLenarDatos = [CamposSegundaEtapa, ValoresSegundaEtapa];
            LlenarCampos(LLenarDatos);

            if (registro.Levantamiento === "0" || registro.Levantamiento === 0) {
                alert("La solicitud no requiere tercera etapa, proceso finalizado.");
                ArrayDeshabilitar.push(CamposPrimeraEtapa, TerceraEtapa, Ficha, CamposSegundaEtapa, ButtonRegistrarPrimeraEtapa);
                DeshabilitarCampos(ArrayDeshabilitar);
                ArrarHabilitar.push(SegundaEtapa);
                HabilitarCampos(ArrarHabilitar);
                return;
            }

            ArrayDeshabilitar.push(CamposPrimeraEtapa, CamposSegundaEtapa, Ficha, ButtonRegistrarPrimeraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            ArrarHabilitar.push(SegundaEtapa, TerceraEtapa, ButtonRegistrarTerceraEtapa, CamposTerceraEtapa);
            HabilitarCampos(ArrarHabilitar);

            FechaTerceraEtapa.value = formatearFechaParaInput(new Date());

            alert("Registro de segunda etapa completo, registrar tercera etapa.");

            return;
        }

        //Tercera etapa completa
        if (registro.FechaTerceraEtapa) {

            const VerDatos = confirm("La solicitud ya cuenta con las tres etapas registradas, ¿desea ver los datos?");

            if (!VerDatos) {
                return;
            }
            LLenarDatos = [CamposPrimeraEtapa, ValoresPrimeraEtapa];
            LlenarCampos(LLenarDatos);

            LLenarDatos = [CamposSegundaEtapa, ValoresSegundaEtapa];
            LlenarCampos(LLenarDatos);

            LLenarDatos = [CamposTerceraEtapa, ValoresTerceraEtapa];
            LlenarCampos(LLenarDatos);
            
            ArrayDeshabilitar.push(CamposPrimeraEtapa, CamposSegundaEtapa, CamposTerceraEtapa, Ficha, ButtonRegistrarPrimeraEtapa, ButtonRegistrarTerceraEtapa);
            DeshabilitarCampos(ArrayDeshabilitar);
            ArrarHabilitar.push(PrimeraEtapa, SegundaEtapa, TerceraEtapa);
            HabilitarCampos(ArrarHabilitar);
            return;
        }

    } catch (error) {
        console.error("Error al consultar la ficha:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

//Formateo de fechas
function formatearFechaParaInput(fechaISO) {
    if (!fechaISO) return "";

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

