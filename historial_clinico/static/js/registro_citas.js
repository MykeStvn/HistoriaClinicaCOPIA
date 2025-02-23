$(document).ready(function () {
    // Inicializar DataTable con datos dinámicos
    var table = $("#tabla_citas").DataTable({
        ajax: {
            url: "/admisionistas/cargar_citas/",
            type: "GET",
            dataSrc: "data", // Ruta donde están los datos en el JSON
        },
        columns: [
            { data: "apellido_paterno_pacientes" }, // Apellido Paterno
            { data: "apellido_materno_pacientes" }, // Apellido Materno
            { data: "nombres_pacientes" }, // Apellido Materno
            { data: "cedula_pacientes" }, // Cédula
            { data: "fecha_cita" }, // Fecha Cita
            { data: "hora_cita" }, // Hora Cita
            { data: "estado_cita" }, // Hora Cita
            { data: "acciones", className: "text-center"} // Acciones (botón eliminar)
        ],
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            decimal: "",
            emptyTable: "No existen atenciones para el día de hoy",
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

    // Manejar la eliminación de citas con AJAX
    $('#tabla_citas').on('click', '.eliminar-cita', function () {
        const idCita = $(this).data('id'); // Obtener el ID de la cita
    
        // Verificar el estado de la cita antes de intentar eliminarla
        $.ajax({
            type: 'GET',
            url: `/admisionistas/verificar_estado_cita/${idCita}/`,
            dataType: 'json',
            success: function(response) {
                let estado = response.estado_cita.trim().toUpperCase(); // Normalizar el estado
    
                if (estado === 'COMPLETADO' || estado === 'CANCELADO') {
                    // Mostrar alerta si la cita no se puede eliminar
                    Swal.fire({
                        icon: 'warning',
                        title: 'Acción no permitida',
                        text: `No puedes eliminar esta atención porque está en estado ${estado}.`,
                        confirmButtonColor: '#ff5f6d'
                    });
                } else {
                    // Mostrar mensaje de confirmación antes de cancelar
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¿Deseas cancelar esta atención? Debes proporcionar un motivo.",
                        input: 'textarea',
                        inputPlaceholder: 'Escribe el motivo de la cancelación...',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Sí, cancelar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const motivoCancelacion = result.value.trim();

                            // Verificar si el motivo está vacío
                            if (!motivoCancelacion) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Motivo vacío',
                                    text: 'Debes proporcionar un motivo para la cancelación.',
                                    confirmButtonColor: '#ff5f6d'
                                });
                                return;
                            }

                            // Enviar petición para cancelar la cita
                            $.ajax({
                                type: 'POST',
                                url: `/admisionistas/cancelar_cita/${idCita}/`,
                                data: {
                                    motivo_cancelacion: motivoCancelacion,
                                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                                },
                                success: function (response) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Atención cancelada',
                                        text: 'La atención ha sido cancelada correctamente.',
                                        confirmButtonColor: '#28a745'
                                    });
                                    // Recargar la tabla para reflejar los cambios
                                    table.ajax.reload();
                                },
                                error: function (xhr) {
                                    let mensajeError = "Error al cancelar la atención.";
                                    if (xhr.status === 403) {
                                        mensajeError = "No puedes cancelar atenciones COMPLETADAS o CANCELADAS.";
                                    } else if (xhr.status === 404) {
                                        mensajeError = "Ateción no encontrada.";
                                    }

                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: mensajeError,
                                        confirmButtonColor: '#ff5f6d'
                                    });
                                },
                            });
                        }
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Imposible verificar el estado de la atención.',
                    confirmButtonColor: '#ff5f6d'
                });
            }
        });
    });
});
