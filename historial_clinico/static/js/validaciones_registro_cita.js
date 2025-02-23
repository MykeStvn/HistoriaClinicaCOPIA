$(document).ready(function () {
    $("#form_historia_clinica").validate({
        rules: {
            presion_arterial_historial: {
                required: true,
                pattern: /^[0-9]{2,3}\/[0-9]{2,3}$/
            },
            temperatura_historial: {
                required: true,
                number: true,
                min: 35,
                max: 42
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
                max: 30
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
                min: 50,
                max: 250
            },
            nombre_sintoma_historial: {
                required: true,
                minlength: 3
            },
            descripcion_sintoma_historial: {
                required: true,
                minlength: 10
            },
            duracion_sintoma_historial: {
                required: true,
                digits: true,
                min: 1
            },
            cie10_diagnostico_historial: {
                required: function () {
                    return $.trim($("#cie10_diagnostico_historial").val()).length === 0;
                }
            },
            medicamento_tratamiento_historial: {
                required: true
            },
            instrucciones_tratamiento_historial: {
                required: true,
                minlength: 5
            },
            fecha_fin_tratamiento_historial: {
                required: true,
                date: true
            }
        },
        messages: {
            presion_arterial_historial: {
                required: "Ingrese la presión arterial.",
                pattern: "Formato incorrecto. Ejemplo: 120/80"
            },
            temperatura_historial: {
                required: "Ingrese la temperatura corporal.",
                number: "Debe ser un número.",
                min: "Temperatura demasiado baja (mínimo 35°C).",
                max: "Temperatura demasiado alta (máximo 42°C)."
            },
            saturacion_oxigeno_historial: {
                required: "Ingrese la saturación de oxígeno.",
                number: "Debe ser un número.",
                min: "Debe ser al menos 80%.",
                max: "No puede ser mayor a 100%."
            },
            frecuencia_respiratoria_historial: {
                required: "Ingrese la frecuencia respiratoria.",
                number: "Debe ser un número.",
                min: "Debe ser al menos 10 respiraciones por minuto.",
                max: "No puede ser mayor a 30 respiraciones por minuto."
            },
            peso_historial: {
                required: "Ingrese el peso del paciente.",
                number: "Debe ser un número.",
                min: "Peso inválido (mínimo 1 kg).",
                max: "Peso demasiado alto (máximo 300 kg)."
            },
            talla_historial: {
                required: "Ingrese la talla del paciente.",
                number: "Debe ser un número.",
                min: "Talla inválida (mínimo 50 cm).",
                max: "Talla demasiado alta (máximo 250 cm)."
            },
            nombre_sintoma_historial: {
                required: "Ingrese el nombre del síntoma.",
                minlength: "Debe tener al menos 3 caracteres."
            },
            descripcion_sintoma_historial: {
                required: "Ingrese la descripción del síntoma.",
                minlength: "Debe tener al menos 10 caracteres."
            },
            duracion_sintoma_historial: {
                required: "Ingrese la duración del síntoma en días.",
                digits: "Debe ser un número entero.",
                min: "Debe ser al menos 1 día."
            },
            cie10_diagnostico_historial: {
                required: "El campo CIE-10 no puede estar en blanco."
            },
            medicamento_tratamiento_historial: {
                required: "Ingrese el medicamento prescrito."
            },
            instrucciones_tratamiento_historial: {
                required: "Ingrese las instrucciones del tratamiento.",
                minlength: "Debe tener al menos 5 caracteres."
            },
            fecha_fin_tratamiento_historial: {
                required: "Seleccione la fecha de finalización del tratamiento.",
                date: "Ingrese una fecha válida."
            }
        },
        errorElement: "div",
        errorClass: "invalid-feedback",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        }
    });

    // 🔒 Bloquear el siguiente campo si el anterior no es válido
    function toggleFieldState(prevField, nextField) {
        $(prevField).on("keyup blur", function () {
            if ($(prevField).valid()) {
                $(nextField).prop("disabled", false);
            } else {
                $(nextField).prop("disabled", true).val("");
            }
        });
    }

    // Ejemplo: bloquear 'temperatura' si 'presión arterial' no es válida
    toggleFieldState("#presion_arterial_historial", "#temperatura_historial");
    toggleFieldState("#temperatura_historial", "#saturacion_oxigeno_historial");
    toggleFieldState("#saturacion_oxigeno_historial", "#frecuencia_respiratoria_historial");
    toggleFieldState("#frecuencia_respiratoria_historial", "#peso_historial");
    toggleFieldState("#peso_historial", "#talla_historial");
    toggleFieldState("#nombre_sintoma_historial", "#descripcion_sintoma_historial");
    toggleFieldState("#descripcion_sintoma_historial", "#duracion_sintoma_historial");
    toggleFieldState("#cie10_diagnostico_historial", "#medicamento_tratamiento_historial");
});
