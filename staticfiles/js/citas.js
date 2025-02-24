$(document).ready(function () {
    $('#tabla_citas').DataTable({
        ajax: {
            url: "/gestion_pacientes/cargar_citas/",
            type: "GET",
            dataSrc: "data", // Ruta donde están los datos en el JSON
        },
        //columnDefs: [ NO BORRAR
          //  { targets: 0, visible: false }, // Ocultar la primera columna (ID)
        //],
        columns: [
            { data: "apellido_paterno_pacientes" }, // Apellido Paterno
            { data: "apellido_materno_pacientes" }, // Apellido Materno
            { data: "nombres_pacientes" }, // Apellido Materno
            { data: "cedula_pacientes" }, // Cédula
            { data: "fecha_cita" }, // Fecha Cita
            { data: "hora_cita" }, // Hora Cita
            { data: "estado_cita" }, // Hora Cita
            { data: "acciones", className : "text-center" } // Acciones (botón eliminar)
        ],
        //AQUI CARGO LA TABLA CON LO DE LA FUNCIÓN DEL VIEW
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            decimal: "",
            emptyTable: "No hay datos disponibles en la tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            lengthMenu: "Mostrar _MENU_ entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "No se han encontrado resultados",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
            },
        },
    });


    
});