//Campos de búsqueda
const EstadoOptions = document.getElementById('SelectEstadoBuscar');
const TextoBusqueda = document.getElementById('TextoBusqueda');

//Boton busqueda
const ButtonBucar = document.getElementById("ButtonBuscar");

//Tabla
const Tabla = document.getElementById("CuerpoTablaBuscar");

async function LLenarTabla() {
    try {
        const estado = EstadoOptions.value;
        const texto = TextoBusqueda.value;

        const url = `http://localhost:3000/api/Busqueda?estado=${encodeURIComponent(estado)}&texto=${encodeURIComponent(texto)}`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            console.log('Error en la solicitud de búsqueda');
            return;
        }

        const data = await respuesta.json();

        console.log("Datos recibidos:", data);

        const registros = data.datos || [];

        console.log("Registros encontrados:", registros);

        Tabla.innerHTML = '';

        if (registros.length === 0) {
            Tabla.innerHTML = `<tr><td colspan="10" class="text-center">No se encontraron resultados</td></tr>`;
            return;
        }

        const filasHTML = registros.map(r => {
            const FechaPE = formatearFechaParaInput(r.FechaPrimeraEtapa) || '';
            const FechaSE = formatearFechaParaInput(r.FechaSegundaEtapa) || '';
            const FechaTE = formatearFechaParaInput(r.FechaTerceraEtapa) || '';

            let DocsEnPunto = '';
            if (FechaTE) {
                if (r.DocumentosEnPunto === 1) {
                    DocsEnPunto = 'Sí';
                } else if (r.DocumentosEnPunto === 0) {
                    DocsEnPunto = 'No';
                }
            };
            return `
                <tr>
                    <td>${FechaPE || ''}</td>
                    <td>${r.Ficha || ''}</td>
                    <td>${r.NombrePuntoAtencion || ''}</td>
                    <td>${r.DescripcionPrimerEtapa || ''}</td>
                    <td>${FechaSE || ''}</td>
                    <td>${r.DescripcionSegundaEtapa || ''}</td>
                    <td>${FechaTE || ''}</td>
                    <td>${DocsEnPunto || ''}</td>
                    <td>${r.NombreTramite || ''}</td>
                    <td>${r.IdRespuesta || ''}</td>
                </tr>
            `;
        }).join('');

        Tabla.innerHTML = filasHTML;

    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
}

//Consultar
ButtonBucar.addEventListener('click', async (e) => {
    e.preventDefault();
    LLenarTabla();
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

window.addEventListener('load', LLenarTabla);
