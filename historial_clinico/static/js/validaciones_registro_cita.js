$(document).ready(function () {
    // Métodos personalizados de validación
    $.validator.addMethod("presionArterial", function(value, element) {
        if (!value) return false;
        var pattern = /^(\d{2,3})\/(\d{2,3})$/;
        if (!pattern.test(value)) return false;
        
        var valores = value.split('/');
        var sistolica = parseInt(valores[0]);
        var diastolica = parseInt(valores[1]);
        
        return (
            sistolica >= 70 && sistolica <= 200 &&
            diastolica >= 40 && diastolica <= 130 &&
            sistolica > diastolica
        );
    }, "Ingrese una presión arterial válida (Sistólica: 70-200/Diastólica: 40-130)");

    function getFechaEcuador() {
        // Crear fecha con zona horaria de Ecuador (GMT-5)
        const fechaEcuador = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Guayaquil"}));
        
        // Formatear fecha a YYYY-MM-DD
        const year = fechaEcuador.getFullYear();
        const month = String(fechaEcuador.getMonth() + 1).padStart(2, '0');
        const day = String(fechaEcuador.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    $.validator.addMethod("fechaNoFutura", function(value, element) {
        if (!value) return true; // deja que required haga su trabajo
        const fechaEcuador = new Date(getFechaEcuador());
        const fechaInput = new Date(value);
        // Resetear las horas para comparar solo fechas
        fechaEcuador.setHours(0,0,0,0);
        fechaInput.setHours(0,0,0,0);
        return fechaInput <= fechaEcuador;
    }, "La fecha no puede ser futura");

    $.validator.addMethod("fechaFinPosterior", function(value, element) {
        if (!value) return true;
        var fechaInicio = new Date($("#fecha_inicio_tratamiento_historial").val());
        var fechaFin = new Date(value);
        return fechaFin >= fechaInicio;
    }, "La fecha de fin debe ser posterior a la fecha de inicio");

    $("#form_historia_clinica").validate({
        ignore: [],
        rules: {
            presion_arterial_historial: {
                required: true,
                presionArterial: true
            },
            temperatura_historial: {
                required: true,
                number: true,
                min: 35,
                max: 45
            },
            saturacion_oxigeno_historial: {
                required: true,
                number: true,
                min: 80,
                max: 100
            },
            frecuencia_respiratoria_historial: {
                required: true,
                number: true,
                min: 10,
                max: 60
            },
            peso_historial: {
                required: true,
                number: true,
                min: 1,
                max: 300
            },
            talla_historial: {
                required: true,
                number: true,
                min: 40,
                max: 280
            },
            nombre_sintoma_historial: {
                required: true,
                minlength: 3
            },
            descripcion_sintoma_historial: {
                required: true,
                minlength: 10
            },
            gravedad_sintoma_historial: {
                required: true
            },
            inicio_sintoma_historial: {
                required: true,
                fechaNoFutura: true
            },
            duracion_sintoma_historial: {
                required: true,
                digits: true,
                min: 1,
                max: 365 // 1 año
            },
            frecuecia_sintoma_historial: {
                required: true,
                minlength: 3
            },
            tipo_sintoma_historial: {
                required: true,
                minlength: 3
            },
            nombre_diagnostico_historial: {
                required: true,
                minlength: 3
            },
            descripcion_diagnostico_historial: {
                required: true,
                minlength: 10
            },
            cie10_diagnostico_historial: {
                required: true,
                minlength: 3
            },
            medicamento_tratamiento_historial: {
                required: true,
                minlength: 3
            },
            instrucciones_tratamiento_historial: {
                required: true,
                minlength: 10
            },
            fecha_fin_tratamiento_historial: {
                required: true,
                fechaFinPosterior: true
            }
        },
        messages: {
            presion_arterial_historial: {
                required: "La presión arterial es obligatoria"
            },
            temperatura_historial: {
                required: "La temperatura es obligatoria",
                number: "Ingrese un número válido",
                min: "Mínimo 35°C",
                max: "Máximo 45°C"
            },
            saturacion_oxigeno_historial: {
                required: "La saturación de oxígeno es obligatoria",
                min: "Mínimo 80%",
                max: "Máximo 100%"
            },
            gravedad_sintoma_historial: {
                required: "Indique la gravedad del síntoma",     
                                           
            },
            nombre_sintoma_historial: {
                required: "El nombre del síntoma es obligatorio",
                minlength: "Mínimo 3 caracteres"
            },
            inicio_sintoma_historial: {
                required: "La fecha de inicio es obligatoria",
                fechaInicioAnterior: true
            },
            descripcion_sintoma_historial: {
                required: "La descripción del síntoma es obligatoria",
                minlength: "Mínimo 10 caracteres"                
            },
            frecuecia_sintoma_historial :{
                required: "La frecuencia del síntoma es obligatoria",
                minlength: "Mínimo 3 caracteres"                
            },
            tipo_sintoma_historial: {
                required: "El tipo de síntoma es obligatorio",
                minlength: "Mínimo 3 caracteres"
            },
            frecuencia_respiratoria_historial: {
                required: "La frecuencia respiratoria es obligatoria",
                min: "Mínimo 10 rpm",
                max: "Máximo 60 rpm (recien nacidos)"
            },
            peso_historial: {
                required: "El peso es obligatorio",
                min: "Mínimo 1 kg",
                max: "Máximo 300 kg"
            },
            duracion_sintoma_historial: {
                required: "La duración del síntoma es obligatoria",
                digits: "Ingrese un número entero",
                min: "Mínimo 1 día",
                max: "Máximo 365 días"
            },
            talla_historial: {
                required: "La talla es obligatoria",
                min: "Mínimo 40 cm",
                max: "Máximo 250 cm"
            },
            nombre_diagnostico_historial: {
                required: "El nombre del diagnóstico es obligatorio",
                minlength: "Mínimo 3 caracteres"
            },
            descripcion_diagnostico_historial: {
                required: "La descripción del diagnóstico es obligatoria",
                minlength: "Mínimo 10 caracteres"                
            },
            cie10_diagnostico_historial: {
                required: "El código CIE-10 es obligatorio",
                minlength: "Mínimo 3 caracteres"
            },
            medicamento_tratamiento_historial: {
                required: "El medicamento es obligatorio",
                minlength: "Mínimo 3 caracteres"
            },
            instrucciones_tratamiento_historial: {
                required: "Las instrucciones de tratamiento son obligatorias",
                minlength: "Mínimo 10 caracteres"                
            },
            fecha_fin_tratamiento_historial: {
                required: "La fecha de fin de tratamiento es obligatoria"
            }
            // ... resto de mensajes similares para cada campo
        },
        errorElement: "div",
        errorClass: "invalid-feedback",
        highlight: function(element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid").addClass("is-valid");
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        submitHandler: function(form) {
            // Verificación final antes de enviar
            if ($(form).valid()) {
                Swal.fire({
                    title: '¿Está seguro?',
                    text: "Va a registrar una nueva historia clínica",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, registrar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit();
                    }
                });
            }
            return false;
        }
    });

    // Inicialización de campos y eventos
    $(document).ready(function() {
        // Validar en tiempo real
        $("input, select, textarea").on("input change", function() {
            $(this).valid();
        });

        // Establecer fecha actual en campos de fecha
        const todayEcuador = getFechaEcuador();
        $("#fecha_atencion_historial").val(todayEcuador);
        $("#fecha_inicio_tratamiento_historial").val(todayEcuador);

        // Opcional: Mostrar feedback visual positivo cuando un campo es válido
        $("input, select, textarea").on("blur", function() {
            if ($(this).valid()) {
                $(this).addClass("is-valid");
            }
        });

        // Validar campos relacionados
        $("#fecha_fin_tratamiento_historial").on("change", function() {
            $(this).valid();
        });

        // Inicializar todos los campos como enabled
        $("input, select, textarea").prop("disabled", false);
    });
});
