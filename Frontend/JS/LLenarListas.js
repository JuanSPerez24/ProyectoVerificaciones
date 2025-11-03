
async function LlenarSelect(url, selectId, campoValor, campoTexto, TextoInicial) {
    const select =document.getElementById(selectId);
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
        console.log(`Error al cargar${selectId}`, error);
    };
};

LlenarSelect("http://localhost:3000/api/TipoDeDocumento", "SelectTipoDocumentoPrimeraEtapa", "IdTipoDocumento", "SiglaTipoDocumento", "Seleccione tipo documento")
LlenarSelect("http://localhost:3000/api/TipoDeDocumento", "SelectTipoDocumentoTerceraEtapa", "IdTipoDocumento", "SiglaTipoDocumento", "Seleccione tipo documento")

LlenarSelect("http://localhost:3000/api/PuntosDeAtencion", "SelectPuntoAtencion", "IdPuntoAtencion", "NombrePuntoAtencion", "Seleccione punto atención")

LlenarSelect("http://localhost:3000/api/CodigosVerificaciones", "SelectCodigoVerificacion", "IdVerificaciones", "DescripcionVerificacion", "Seleccione verificación")

LlenarSelect("http://localhost:3000/api/Tramites", "SelectTramiteRealizado", "IdTramite", "NombreTramite", "Seleccione tramite realizado")

LlenarSelect("http://localhost:3000/api/verificaciones/informador", "SelectInformadorPrimeraEtapa", "IdInformador", "NombreInformador", "Seleccione Iinformador")
LlenarSelect("http://localhost:3000/api/verificaciones/informador", "SelectInformadorTerceraEtapa", "IdInformador", "NombreInformador", "Seleccione Iinformador")

LlenarSelect("http://localhost:3000/api/Tipologias", "SelectTipologia1", "IdTipologia", "NombreTramite", "Seleccione tipologia 1")
LlenarSelect("http://localhost:3000/api/Tipologias", "SelectTipologia2", "IdTipologia", "NombreTramite", "Seleccione tipologia 2")
LlenarSelect("http://localhost:3000/api/Tipologias", "SelectTipologia3", "IdTipologia", "NombreTramite", "Seleccione tipologia 3")

