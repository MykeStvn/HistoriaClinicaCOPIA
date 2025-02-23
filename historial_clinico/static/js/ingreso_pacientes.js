$(document).ready(function () {
  var table = $("#tabla_pacientes").DataTable({
    columnDefs: [
      { targets: 0, visible: false }, // Ocultar la primera columna (ID)
    ],
    "columns": [
      { "data": "id_pacientes", "visible": false },  // Columna ID oculta
      { "data": "apellido_paterno_pacientes" }, // Apellido Paterno
      { "data": "apellido_materno_pacientes" }, // Apellido Materno
      { "data": "nombres_pacientes" }, // Nombres
      { "data": "cedula_pacientes" }, // Cédula
      { "data": "fecha_nacimiento_pacientes" }, // Fecha de Nacimiento
      { "data": "edad" }, // Edad
      { "data": "direccion_pacientes" }, // Dirección
      { "data": "email_pacientes" }, // Email
      { "data": "genero_pacientes" }, // Género
      { "data": "telefono_pacientes" }, // Teléfono
      { "data": "emergencia_informar_pacientes" }, // En caso de emergencia informar a
      { "data": "contacto_emergencia_pacientes" }, // Contacto de emergencia
      { "data": "seguro_pacientes" }, // Seguro Médico
      { "data": "fk_id_admisionista__username" }, // Admisionista
      { "data": "acciones" }  // Acciones
    ],
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50, 100],
    language: {
      decimal: "",
      emptyTable: "No hay datos disponibles en la tabla",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      infoEmpty: "Mostrando 0 a 0 de 0 entradas",
      infoFiltered: "(filtrado de _MAX_ entradas totales)",
      infoPostFix: "",
      thousands: ",",
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
      aria: {
        sortAscending: ": activar para ordenar la columna de manera ascendente",
        sortDescending: ": activar para ordenar la columna de manera descendente",
      },
    },
  });

  // CALCULAR FECHA ACTUAL PARA CONFIGURACION DEL CALENDARIO

  document.addEventListener("DOMContentLoaded", function () {
    const inputFecha = document.getElementById("fecha_nacimiento_pacientes");

    // Calcular la fecha de hoy
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0"); // Enero es 0
    const anio = hoy.getFullYear();

    // Establecer un rango
    inputFecha.setAttribute("max", `${anio}-${mes}-${dia}`); // No permite fechas futuras
    inputFecha.setAttribute("min", "1925-01-01"); // Fecha mínima fija
  });



  // Evento de clic en el botón de eliminar (delegación de eventos)  OK
  $(document).on("click", ".btn-delete", function () {
    var pacienteId = $(this).data("id"); // Obtén el ID del paciente a eliminar    

    // Preguntar al usuario si está seguro de eliminar
    Swal.fire({
      title: "¿Estás seguro de eliminar este paciente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar la petición AJAX para eliminar al paciente
        $.ajax({
          url: "/admisionistas/eliminar_paciente/" + pacienteId + "/",
          method: "DELETE", // O el método adecuado según tu backend
          success: function (response) {
            if (response.status === "success") {
              // Mostrar Toastify al eliminar
              Toastify({
                text: "Paciente eliminado correctamente.",
                duration: 3000,
                close: false,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(to right,rgb(253, 42, 42),rgb(253, 42, 42))",
              }).showToast();
            } else {
              Swal.fire("Error", "Hubo un error al eliminar el paciente.", "error");
            }
          },
          error: function () {
            Swal.fire("Error", "Error al eliminar el paciente.", "error");
          },
        });
      }
    });

  });

  
  //ingresar paciente
  $(document).ready(function () {
    // Validación del formulario de agregar paciente
    $.validator.addMethod(
      "lettersOnly",
      function (value, element) {
        return (
          this.optional(element) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
        );
      },
      "Por favor, ingrese solo letras."
    );
    // Validación personalizada para números
    $.validator.addMethod(
      "numbersOnly",
      function (value, element) {
        return this.optional(element) || /^[0-9]+$/.test(value);
      },
      "Por favor, ingrese solo números."
    );
    $.validator.addMethod(
      "validDateRange",
      function (value, element) {
        const fechaSeleccionada = new Date(value);
        const hoy = new Date();
        const fechaMinima = new Date("1925-01-01");

        return (
          this.optional(element) ||
          (fechaSeleccionada >= fechaMinima && fechaSeleccionada <= hoy)
        );
      },
      "Por favor, seleccione una fecha válida dentro del rango permitido."
    );
    $("#formAddPaciente").validate({
      rules: {
        apellido_paterno_pacientes: {
          required: true,
          maxlength: 50,
          lettersOnly: true,
        },
        apellido_materno_pacientes: {
          required: true,
          maxlength: 50,
          lettersOnly: true,
        },
        nombres_pacientes: {
          required: true,
          maxlength: 100,
          lettersOnly: true,
        },
        cedula_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10,
          numbersOnly: true,
          remote: {
            // Validación remota para la cédula
            url: "/admisionistas/verificar_cedula/", // Cambia la ruta si es necesario
            type: "post",
            data: {
              cedula_pacientes: function () {
                return $("#cedula_pacientes").val(); // Obtiene el valor de la cédula
              },
              csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            },
            dataFilter: function (response) {
              const data = JSON.parse(response);
              return !data.exists; // Retorna true si no existe
            },
          },
        },
        fecha_nacimiento_pacientes: {
          required: true,
          date: true,
          validDateRange: true,
        },
        direccion_pacientes: {
          required: true,
          maxlength: 200,
        },
        email_pacientes: {
          required: true,
          email: true,
        },
        telefono_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10,
          numbersOnly: true,
        },
        emergencia_informar_pacientes: {
          required: true,
          maxlength: 100,
          lettersOnly: true,
        },
        contacto_emergencia_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10,
          numbersOnly: true,
        },
        genero_pacientes: {
          required: true,
        },
        seguro_pacientes: {
          required: true,
        },
        estado_civil_pacientes: {
          required: true,
        },
        lugar_nacimiento_pacientes:{
          required:true,
          lettersOnly:true,
        },
        nacionalidad_pacientes:{
          required:true,
          lettersOnly:true,
        },
        grupo_cultural_pacientes:{
          required:true,
          lettersOnly:true,
        },
        instruccion_academica_pacientes: {
          required: true,
        },
        ocupacion_pacientes: {
          required:true,
          lettersOnly:true,
        },
        empresa_trabaja_pacientes: {
          required:true,
          lettersOnly:true,
        },
        parentesco_pacientes: {
          required:true,
          lettersOnly:true,
        },
        fk_id_admisionista: {
          required: true,
        },
      },
      messages: {
        apellido_paterno_pacientes: {
          required: "Por favor, ingrese el apellido paterno.",
          maxlength: "El apellido paterno no puede exceder los 50 caracteres.",
        },
        apellido_materno_pacientes: {
          required: "Por favor, ingrese el apellido materno.",
          maxlength: "El apellido materno no puede exceder los 50 caracteres.",
        },
        nombres_pacientes: {
          required: "Por favor, ingrese los nombres.",
          maxlength: "El nombre no puede exceder los 100 caracteres.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        cedula_pacientes: {
          required: "Por favor, ingrese la cédula.",
          numbersOnly: "Por favor, ingrese solo números.",
          minlength: "La cédula debe tener al menos 10 caracteres.",
          maxlength: "La cédula no puede exceder los 10 caracteres.",

          remote:
            "Esta cédula ya está registrada en el sistema o no es ecuatoriana.",
        },
        fecha_nacimiento_pacientes: {
          required: "Por favor, ingrese la fecha de nacimiento.",
          date: "Por favor, ingrese una fecha válida.",
          validDateRange: "Por favor, seleccione una fecha válida dentro del rango permitido.",
        },
        direccion_pacientes: {
          required: "Por favor, ingrese la dirección.",
          maxlength: "La dirección no puede exceder los 200 caracteres.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        email_pacientes: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo electrónico válido.",
        },
        telefono_pacientes: {
          required: "Por favor, ingrese el teléfono.",
          minlength: "El teléfono debe tener al menos 10 caracteres.",
          maxlength: "El teléfono no puede exceder los 10 caracteres.",
          numbersOnly: "Por favor, ingrese solo números.",
        },
        emergencia_informar_pacientes: {
          required:
            "Por favor, ingrese el nombre de la persona a la que se debe informar en caso de emergencia.",
          maxlength:
            "El nombre de la persona no puede exceder los 100 caracteres.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        contacto_emergencia_pacientes: {
          required: "Por favor, ingrese el número de contacto de emergencia.",
          minlength: "El número de contacto debe tener al menos 10 caracteres.",
          maxlength:
            "El número de contacto de emergencia no puede exceder los 10 caracteres.",
        },
        genero_pacientes: {
          required: "Por favor, seleccione el género.",
        },
        seguro_pacientes: {
          required: "Por favor, seleccione el seguro médico.",
        },
        estado_civil_pacientes: {
          required: "Por favor, selecciona el estado civíl",
        },
        lugar_nacimiento_pacientes: {
          required: "Por favor, ingrese el lugar de nacimiento.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        nacionalidad_pacientes: {
          required: "Por favor, ingrese la nacionalidad.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        grupo_cultural_pacientes: {
          required: "Por favor, ingrese el grupo cultural.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        instruccion_academica_pacientes: {
          required: "Por favor, ingrese la instrucción académica.",
        },
        ocupacion_pacientes: {
          required: "Por favor, ingrese la ocupación.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        empresa_trabaja_pacientes: {
          required: "Por favor, ingrese la empresa donde trabaja.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        parentesco_pacientes: {
          required: "Por favor, ingrese el parentesco o afinidad.",
          lettersOnly: "Por favor, ingrese solo letras.",
        },
        fk_id_admisionista: {
          required: "Este campo es obligatorio.",
        },
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.after(error); // Colocar el mensaje de error después del campo
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
      },
      submitHandler: function (form) {
        // Enviar el formulario por AJAX si la validación es exitosa
        $.ajax({
          url: $(form).attr("action"),
          method: "POST",
          data: $(form).serialize(),
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_pacientes").DataTable();
              let fechaFormateada = moment(response.paciente.fecha_nacimiento)
                .locale("es")
                .format("DD [de] MMMM [de] YYYY");
              table.row
                .add({
                  id_pacientes: response.paciente.id_pacientes,
                  apellido_paterno_pacientes:
                    response.paciente.apellido_paterno,
                  apellido_materno_pacientes:
                    response.paciente.apellido_materno,
                  nombres_pacientes: response.paciente.nombres,
                  cedula_pacientes: response.paciente.cedula,
                  fecha_nacimiento_pacientes: fechaFormateada,
                  edad: response.paciente.edad,
                  lugar_nacimiento_pacientes: response.paciente.lugar_nacimiento,
                  nacionalidad_pacientes: response.paciente.nacionalidad,
                  grupo_cultural_pacientes: response.paciente.grupo_cultural,
                  direccion_pacientes: response.paciente.direccion,
                  email_pacientes: response.paciente.email,
                  telefono_pacientes: response.paciente.telefono,
                  estado_civil_pacientes: response.paciente.estado_civil,
                  genero_pacientes: response.paciente.genero,
                  instruccion_academica_pacientes: response.paciente.instruccion_academica,
                  ocupacion_pacientes: response.paciente.ocupacion,
                  empresa_trabaja_pacientes: response.empresa_trabaja,
                  seguro_pacientes: response.paciente.seguro,
                  emergencia_informar_pacientes:
                    response.paciente.emergencia_informar,
                  parentesco_pacientes: response.parentesco,
                  contacto_emergencia_pacientes:
                    response.paciente.contacto_emergencia,
                  fk_id_admisionista__username: response.paciente.admisionista,
                  acciones: `<a href="#" class="btn btn-warning edit-btn" data-id="${response.paciente.id_pacientes}">Ver Detalles</a>
                          <a href="#" class="btn btn-warning edit-btn" data-id="${response.paciente.id_pacientes}">Editar</a>
                          <a href="#" class="btn btn-danger btn-delete" data-id="${response.paciente.id_pacientes}">Eliminar</a>`,
                })
                .draw(false);

              Toastify({
                text: "Paciente guardado correctamente",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();
              $("#formAddPaciente")[0].reset();
              $("#addIngresoPacientesModal").modal("hide");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
            } else if (response.status === "cedula_exists") {
              $("#cedula_pacientes").addClass("is-invalid");
              $("#cedula_pacientes").after(
                '<div class="invalid-feedback">Esta cédula ya está registrada en el sistema o no es ecuatoriana.</div>'
              );
            } else {
              alert("Error al agregar el paciente");
            }
          },
          error: function () {
            alert("Error al procesar la solicitud");
          },
        });
      },
    });
  });

  //EL BOTON EDIT ESTABA AQUI 

  //cargar los datos en el botón ver detalles
  $(document).on("click", ".view-btn", function () {
    var pacienteId = $(this).data("id"); // Obtener el ID del paciente desde el atributo data-id
    verPaciente(pacienteId);
  });
  // Hacer una solicitud AJAX a tu vista en Django
  function verPaciente(pacienteId) {
    //Cierre de moda si esta abierto
    $("viewPacienteModal").modal("hide");
    $.ajax({
      url: "/admisionistas/obtener_paciente/" + pacienteId + "/",
      method: "GET",
      success: function (data) {
        $("#view_pacienteId").val(data.paciente.id_pacientes);
        $("#view_apellido_paterno_pacientes").val(
          data.paciente.apellido_paterno
        );
        $("#view_apellido_materno_pacientes").val(
          data.paciente.apellido_materno
        );
        $("#view_nombres_pacientes").val(data.paciente.nombres);
        $("#view_cedula_pacientes").val(data.paciente.cedula);
        $("#view_fecha_nacimiento_pacientes").val(
          data.paciente.fecha_nacimiento
        );
        $("#view_edad_paciente").val(data.paciente.edad);
        $("#view_lugar_nacimiento_pacientes").val(data.paciente.lugar_nacimiento);
        $("#view_nacionalidad_pacientes").val(data.paciente.nacionalidad);
        $("#view_grupo_cultural_pacientes").val(data.paciente.grupo_cultural);
        $("#view_direccion_pacientes").val(data.paciente.direccion);
        $("#view_email_pacientes").val(data.paciente.email);
        $("#view_telefono_pacientes").val(data.paciente.telefono);
        $("#view_estado_civil_pacientes").val(data.paciente.estado_civil);
        $("#view_instruccion_academica_pacientes").val(data.paciente.instruccion_academica);
        $("#view_ocupacion_pacientes").val(data.paciente.ocupacion);
        $("#view_empresa_trabaja_pacientes").val(data.paciente.empresa_trabaja);
        $("#view_emergencia_informar_pacientes").val(
          data.paciente.emergencia_informar
        );
        $("#view_parentesco_pacientes").val(data.paciente.parentesco);
        $("#view_contacto_emergencia_pacientes").val(
          data.paciente.contacto_emergencia
        );
        $("#view_fk_id_admisionista").val(data.paciente.admisionista);

        // Género
        if (
          data.paciente.genero !== "MASCULINO" &&
          data.paciente.genero !== "FEMENINO"
        ) {
          $("#view_genero_otro_div").show();
          $("#view_genero_otro").val(data.paciente.genero);
          $("#view_genero_pacientes").val("Otro");
        } else {
          $("#view_genero_otro_div").hide();
          $("#view_genero_otro").val("");
          $("#view_genero_pacientes").val(data.paciente.genero);          
        }

        // Seguro
        if (
          data.paciente.seguro !== "NINGUNO" &&
          data.paciente.seguro !== "IESS" &&
          data.paciente.seguro !== "ISSPOL" &&
          data.paciente.seguro !== "ISSFA"
        ) {
          $("#view_seguro_otro_div").show();
          $("#view_seguro_otro").val(data.paciente.seguro);
          $("#view_seguro_pacientes_select").val("Otro");
        } else {
          $("#view_seguro_otro_div").hide();
          $("#view_seguro_otro").val("");
          $("#view_seguro_pacientes").val(data.paciente.seguro);
        }
        //ESTADO
        const isActive = data.paciente.is_active;
        const badge = $("#view_is_active");

        // Actualizar texto y clases del badge
        badge.text(isActive ? "Activo" : "Inactivo");
        badge.removeClass("badge-success badge-danger"); // Limpiar clases previas
        badge.addClass(isActive ? "badge-success" : "badge-danger"); // Añadir clases según el estado
        $("#viewIngresoPacientesModal").modal("show");
      },
      error: function () {
        alert("Error al obtener los datos del paciente.");
      },
    });
  }


  // FUNCION PARA MOSTRAR MODAL CON DATOS AL DAR CLICK EN EL BOTON DE EDITAR

  $(document).on("click", ".edit-btn", function () {
    var pacienteId = $(this).data("id");
    editarPaciente(pacienteId);
  });


  // Función para cargar datos de un paciente en el modal de edición
  function editarPaciente(pacienteId) {
    // Cierra el modal si está abierto
    $("#editIngresoPacientesModal").modal("hide");
    $.ajax({
      url: "/admisionistas/obtener_paciente/" + pacienteId + "/",
      method: "GET",
      success: function (data) {
        $("#edit_pacienteId").val(data.paciente.id_pacientes);
        $("#edit_apellido_paterno_pacientes").val(
          data.paciente.apellido_paterno
        );
        $("#edit_apellido_materno_pacientes").val(
          data.paciente.apellido_materno
        );
        $("#edit_nombres_pacientes").val(data.paciente.nombres);
        $("#edit_cedula_pacientes").val(data.paciente.cedula);
        $("#edit_fecha_nacimiento_pacientes").val(
          data.paciente.fecha_nacimiento
        );
        $("#edit_lugar_nacimiento_pacientes").val(data.paciente.lugar_nacimiento);
        $("#edit_nacionalidad_pacientes").val(data.paciente.nacionalidad);
        $("#edit_grupo_cultural_pacientes").val(data.paciente.grupo_cultural);
        $("#edit_direccion_pacientes").val(data.paciente.direccion);
        $("#edit_email_pacientes").val(data.paciente.email);
        $("#edit_telefono_pacientes").val(data.paciente.telefono);
        $("#edit_estado_civil_pacientes").val(data.paciente.estado_civil);
        $("#edit_instruccion_academica_pacientes_select").val(data.paciente.instruccion_academica);
        $("#edit_ocupacion_pacientes").val(data.paciente.ocupacion);
        $("#edit_empresa_trabaja_pacientes").val(data.paciente.empresa_trabaja);
        $("#edit_emergencia_informar_pacientes").val(
          data.paciente.emergencia_informar
        );
        $("#edit_parentesco_pacientes").val(data.paciente.parentesco);
        $("#edit_contacto_emergencia_pacientes").val(
          data.paciente.contacto_emergencia
        );
        $("#edit_fk_id_admisionista").val(data.paciente.admisionista);
        $("#edit_is_active_pacientes_select").val(data.paciente.is_active ? 'true' : 'false');


        // Género
        if (
          data.paciente.genero !== "MASCULINO" &&
          data.paciente.genero !== "FEMENINO"
        ) {
          $("#edit_genero_otro_div").show();
          $("#edit_genero_otro").val(data.paciente.genero);
          $("#edit_genero_pacientes_select").val("Otro");
        } else {
          $("#edit_genero_otro_div").hide();
          $("#edit_genero_otro").val("");
          $("#edit_genero_pacientes_select").val(data.paciente.genero);
        }

        // Seguro
        if (
          data.paciente.seguro !== "NINGUNO" &&
          data.paciente.seguro !== "IESS" &&
          data.paciente.seguro !== "ISSPOL" &&
          data.paciente.seguro !== "ISSFA"
        ) {
          $("#edit_seguro_otro_div").show();
          $("#edit_seguro_otro").val(data.paciente.seguro);
          $("#edit_seguro_pacientes_select").val("Otro");
        } else {
          $("#edit_seguro_otro_div").hide();
          $("#edit_seguro_otro").val("");
          $("#edit_seguro_pacientes_select").val(data.paciente.seguro);
        }
        

        $("#editIngresoPacientesModal").modal("show");
      },
      error: function () {
        alert("Error al obtener los datos del paciente.");
      },
    });
  }

  // Lógica para mostrar/ocultar el campo "Otro" en el formulario de género
  $("#genero_pacientes_select, #edit_genero_pacientes_select, #view_genero_pacientes").on(
    "change",
    function () {
      const value = $(this).val();
      let generoOtroDiv, generoOtroInput;

      if ($(this).attr("id") === "genero_pacientes_select") {
        generoOtroDiv = $("#genero_otro_div");
        generoOtroInput = $("#genero_otro");
      } else if ($(this).attr("id") === "edit_genero_pacientes_select") {
        generoOtroDiv = $("#edit_genero_otro_div");
        generoOtroInput = $("#edit_genero_otro");
      } else if ($(this).attr("id") === "view_genero_pacientes") {
        generoOtroDiv = $("#view_genero_otro_div");
        generoOtroInput = $("#view_genero_otro");
      }

      if (value === "Otro") {
        generoOtroDiv.show();
        generoOtroInput.prop("required", true);
      } else {
        generoOtroDiv.hide();
        generoOtroInput.val("");
        generoOtroInput.prop("required", false);
      }
    }
  );

  // Lógica para mostrar/ocultar el campo "Otro" en el formulario de seguro
  $("#seguro_pacientes_select, #edit_seguro_pacientes_select, #view_seguro_pacientes").on(
    "change",
    function () {
      const value = $(this).val();
      let seguroOtroDiv, seguroOtroInput;

      if ($(this).attr("id") === "seguro_pacientes_select") {
        seguroOtroDiv = $("#seguro_otro_div");
        seguroOtroInput = $("#seguro_otro");
      } else if ($(this).attr("id") === "edit_seguro_pacientes_select") {
        seguroOtroDiv = $("#edit_seguro_otro_div");
        seguroOtroInput = $("#edit_seguro_otro");
      } else if ($(this).attr("id") === "view_seguro_pacientes") {
        seguroOtroDiv = $("#view_seguro_otro_div");
        seguroOtroInput = $("#view_seguro_otro");
      }

      if (value === "Otro") {
        seguroOtroDiv.show();
        seguroOtroInput.prop("required", true);
      } else {
        seguroOtroDiv.hide();
        seguroOtroInput.val("");
        seguroOtroInput.prop("required", false);
      }
    }
  );

  //actualizar
  $(document).ready(function () {
    $("#formEditPaciente").validate({
      rules: {
        apellido_paterno_pacientes: {
          required: true,
          maxlength: 50,
          lettersOnly: true,
        },
        apellido_materno_pacientes: {
          required: true,
          maxlength: 50,
          lettersOnly: true,
        },
        nombres_pacientes: {
          required: true,
          maxlength: 100,
          lettersOnly: true
        },
        cedula_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10,
          numbersOnly: true,
          remote: {
            url: "/admisionistas/verificar_cedula_actualizar/", // Ruta para la verificación de la cédula
            type: "POST",
            data: {
              cedula_pacientes: function () {
                return $("#edit_cedula_pacientes").val(); // Obtiene el valor de la cédula
              },
              paciente_id: function () {
                return $("#edit_pacienteId").val(); // Obtiene el ID del paciente que está siendo editado
              },
              csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(), // Asegúrate de incluir el token CSRF
            },
            dataFilter: function (response) {
              const data = JSON.parse(response);
              return !data.exists; // Retorna true si no existe (la cédula es válida)
            },
          },
        },
        fecha_nacimiento_pacientes: {
          required: true,
          date: true,
          validDateRange: true,
        },
        direccion_pacientes: {
          required: true,
          maxlength: 200
        },
        email_pacientes: {
          required: true,
          email: true
        },
        estado_civil_pacientes: {
          required: true
        },
        telefono_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 15,
          numbersOnly: true,
        },
        emergencia_informar_pacientes: {
          required: true,
          maxlength: 100,
          lettersOnly: true,
        },
        contacto_emergencia_pacientes: {
          required: true,
          maxlength: 100,
          numbersOnly: true,
        },
        genero_pacientes: {
          required: true
        },
        seguro_pacientes: {
          required: true
        },
        fk_id_admisionista: {
          required: true
        }
      },
      messages: {
        apellido_paterno_pacientes: {
          required: "Por favor, ingrese el apellido paterno.",
          maxlength: "El apellido paterno no puede exceder los 50 caracteres."
        },
        apellido_materno_pacientes: {
          required: "Por favor, ingrese el apellido materno.",
          maxlength: "El apellido materno no puede exceder los 50 caracteres."
        },
        nombres_pacientes: {
          required: "Por favor, ingrese los nombres.",
          maxlength: "El nombre no puede exceder los 100 caracteres.",
          lettersOnly: "Por favor, ingrese solo letras."
        },
        cedula_pacientes: {
          required: "Por favor, ingrese la cédula.",
          minlength: "La cédula debe tener al menos 10 caracteres.",
          maxlength: "La cédula no puede exceder los 10 caracteres.",
          remote:
            "Esta cédula ya está registrada en el sistema o no es ecuatoriana.",
        },
        fecha_nacimiento_pacientes: {
          required: "Por favor, ingrese la fecha de nacimiento.",
          date: "Por favor, ingrese una fecha válida."
        },
        direccion_pacientes: {
          required: "Por favor, ingrese la dirección.",
          maxlength: "La dirección no puede exceder los 200 caracteres.",
          lettersOnly: true,
        },
        email_pacientes: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo electrónico válido."
        },
        estado_civil: {
          required: "Por favor, selecciona el estado civíl."
        },
        telefono_pacientes: {
          required: "Por favor, ingrese el teléfono.",
          minlength: "El teléfono debe tener al menos 10 caracteres.",
          maxlength: "El teléfono no puede exceder los 15 caracteres."
        },
        emergencia_informar_pacientes: {
          required: "Por favor, ingrese el nombre de la persona a la que se debe informar en caso de emergencia.",
          maxlength: "El nombre de la persona no puede exceder los 100 caracteres."
        },
        contacto_emergencia_pacientes: {
          required: "Por favor, ingrese el contacto de emergencia.",
          maxlength: "El contacto de emergencia no puede exceder los 100 caracteres."
        },
        genero_pacientes: {
          required: "Por favor, seleccione el género."
        },
        seguro_pacientes: {
          required: "Por favor, seleccione el seguro médico."
        },
        fk_id_admisionista: {
          required: "Este campo es obligatorio."
        }
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.after(error); // Colocar el mensaje de error después del campo
      },
      highlight: function (element) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
      submitHandler: function (form) {
        var formData = $(form).serialize();
        $.ajax({
          url: "/admisionistas/actualizar_paciente/", // URL de tu endpoint de actualización
          method: "POST",
          data: formData,
          dataType: 'json',
          success: function (response) {
            if (response.status === "success") {
              Toastify({
                text: "Paciente actualizado correctamente",
                duration: 5000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();

              $("#editIngresoPacientesModal").modal("hide");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
              // Recargar la página
              // location.reload();
              // Actualizar la lista de pacientes sin recargar la página
              var updatedPaciente = response.paciente; // Asegúrate de enviar el paciente actualizado desde el servidor
              // Encuentra el item correspondiente en la lista y actualízalo
              var pacienteItem = $("#patientList").find(".list-group-item[data-id='" + updatedPaciente.id_pacientes + "']");
              if (updatedPaciente && updatedPaciente.nombres) {
                pacienteItem.find(".paciente-nombre").html(updatedPaciente.nombres + " " + updatedPaciente.apellido_paterno + " " + updatedPaciente.apellido_materno);
                pacienteItem.find(".paciente-edad").html("<b>Edad: </b>" + updatedPaciente.edad);
                pacienteItem.find(".paciente-cedula").html("<b>Cédula: </b>" + updatedPaciente.cedula);
                pacienteItem.find(".paciente-seguro").html("<b>Seguro Médico: </b>" + updatedPaciente.seguro);  // Si "seguro" es el nombre correcto del campo
                pacienteItem.find(".paciente-emergencia").html("<b>En caso de emergencia llamar a: </b>" + updatedPaciente.emergencia_informar);
                pacienteItem.find(".paciente-contacto").html("<b>Teléfono: </b>" + updatedPaciente.contacto_emergencia);
              } else {
                console.log("Datos del paciente no disponibles", updatedPaciente);
              }
            } else if (response.status === "cedula_exists") {
              $("#edit_cedula_pacientes").addClass("is-invalid");
              $("#edit_cedula_pacientes").after('<div class="invalid-feedback">Esta cédula ya está registrada en el sistema o no es ecuatoriana.</div>');
            } else {
              Toastify({
                text: "Cédula duplicada, imposible actualizar.",
                duration: 5000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF3B30, #FF5C5C)",
              }).showToast();
              console.error("Error del servidor:", response);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error en la petición AJAX:", status, error, xhr.responseText);
            alert("Hubo un problema al actualizar el paciente. Revisa la consola.");
          }
        });
      }
    });
  });

  //CITAS
  //agregar cita
  $(document).ready(function () {
    // Escuchar el clic en el botón "Registrar Cita"
    $('.registrar-cita').on('click', function (event) {
        event.preventDefault(); // Prevenir la recarga de la página

        // Obtener los datos necesarios
        const url = $(this).data('url'); // URL de la vista Django
        const pacienteId = $(this).data('paciente-id'); // ID del paciente

        // Verificar si se obtuvo el ID del paciente
        if (!pacienteId) {
            Toastify({
                text: "Error: ID de paciente no encontrado.",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                duration: 3000,
                close: true,
            }).showToast();
            return;
        }

        // Obtener la fecha y hora actuales
        const fechaActual = new Date();
        const fechaCita = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const horaCita = fechaActual.toTimeString().split(' ')[0].slice(0, 5); // Formato HH:mm

        // Enviar la solicitud AJAX
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                fk_id_paciente: pacienteId,
                fecha_cita: fechaCita,
                hora_cita: horaCita,
                estado_cita: 'PENDIENTE', // Estado predeterminado
            },
            success: function (response) {
                // Mostrar mensaje de éxito
                Toastify({
                    text: "Atención asignada correctamente",
                    backgroundColor: "linear-gradient(to right, #56ab2f, #a8e063)",
                    duration: 5000,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            },
            error: function (xhr) {
                // Mostrar mensaje de error
                const error = JSON.parse(xhr.responseText).error;
                Toastify({
                    text: "No se puede registrar cita médica",
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    duration: 5000,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        });
    });
  });

});