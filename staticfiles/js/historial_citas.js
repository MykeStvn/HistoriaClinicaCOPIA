$(document).ready(function () {
    // Inicializar DataTable con datos dinámicos
    var table = $("#tabla_citas_historial").DataTable({
        ajax: {
            url: "/admisionistas/cargar_historial_citas/", // Ruta para cargar citas
            type: "GET",
            dataSrc: "data", // Ruta donde están los datos en el JSON
        },
        columns: [
            { data: "apellido_paterno_pacientes" }, // Apellido Paterno
            { data: "apellido_materno_pacientes" }, // Apellido Materno
            { data: "nombres_pacientes" }, // Nombres
            { data: "cedula_pacientes" }, // Cédula
            { data: "fecha_cita" }, // Fecha Cita
            { data: "hora_cita" }, // Hora Cita
        ],
        order: [[4, "desc"]], // Ordenar por la columna de fecha_cita (índice 4) de manera ascendente
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            decimal: "",
            emptyTable: "No hay datos disponibles para hoy.",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            lengthMenu: "Mostrar _MENU_ entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "No se encontraron atenciones para hoy.",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
            },
        },
    });
});
