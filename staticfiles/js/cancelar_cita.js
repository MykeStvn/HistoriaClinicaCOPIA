$(document).ready(function() {
    // Evento para manejar el clic en el botón de cancelar
    $(document).on('click', '.cancelar-cita', function() {
        var idCita = $(this).data('id');
        var btnCancelar = $(this);

        // Confirmación antes de cancelar la cita
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres cancelar esta atención?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar solicitud AJAX para cancelar la cita
                $.ajax({
                    url: '/gestion_pacientes/cancelar_cita/' + idCita + '/', // Reemplaza con la URL correcta de la vista de cancelación
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: {
                        'csrfmiddlewaretoken': $('#csrf_token').val(), // Usamos el token CSRF desde el campo oculto
                    },
                    success: function(response) {
                        // Si la cancelación es exitosa, muestra un SweetAlert de éxito
                        Swal.fire(
                            '¡Cancelada!',
                            response.message,  // Puedes personalizar el mensaje que venga en la respuesta
                            'success'
                        ).then(() => {
                            // Esperar 2 segundos antes de recargar la página
                            setTimeout(function() {
                                location.reload(); // Recarga la página
                            }, 500);  // 2000 milisegundos = 2 segundos
                        });

                        btnCancelar.closest('tr').find('.estado-cita').text('CANCELADO'); // Actualiza el estado en la fila
                        btnCancelar.prop('disabled', true); // Desactiva el botón de cancelar
                        btnCancelar.closest('tr').find('.estado-cita').addClass('cancelado'); // Opcional: añade una clase para destacar la fila
                    },
                    error: function(response) {
                        // En caso de error, muestra un SweetAlert de error
                        Swal.fire(
                            'Error',
                            response.responseJSON.error,  // Puedes personalizar el mensaje que venga en la respuesta
                            'error'
                        );
                    }
                });
            }
        });
    });
});
