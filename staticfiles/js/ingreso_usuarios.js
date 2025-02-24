$(document).ready(function () {
  var table = $("#tabla_usuarios").DataTable({
    columnDefs: [],
    columns: [
      // Columna ID oculta 0
      { data: "image" }, // 13
      { data: "first_name" }, // 5
      { data: "last_name" }, //  6
      { data: "username" }, //  4
      { data: "tipo_usuario" }, // 11
      { data: "is_active" }, //  9
      { data: "acciones" }, // Acciones
    ],
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
        sortDescending:
          ": activar para ordenar la columna de manera descendente",
      },
    },
  });

  //ELIMINAR USUARIO OK
  // Evento de clic en el botón de eliminar (delegación de eventos)  OK
  $(document).on("click", ".btn-delete", function () {
    var usuarioId = $(this).data("id"); // Obtén el ID del usuario a eliminar
    var fila = $(this).closest("tr"); // Almacena la fila donde se encuentra el botón

    // Obtener el nombre y apellido del usuario desde la fila
    var nombre = fila.find("td").eq(1).text(); // Nombre
    var apellido = fila.find("td").eq(2).text(); // Apellido
    var usuario = fila.find("td").eq(3).text(); // Usuario

    // Preguntar al usuario si está seguro de eliminar
    Swal.fire({
      title: "¿Estás seguro de eliminar a este usuario?",
      text:
        "Eliminarás a: " + nombre + " " + apellido + " | Usuario: " + usuario,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar la petición AJAX para eliminar al usuario
        $.ajax({
          url: "/administradores/eliminar_usuario/" + usuarioId + "/",
          method: "DELETE", // O el método adecuado según tu backend
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_usuarios").DataTable();
              table.row(fila).remove().draw(false); // 'false' mantiene la página actual al redibujar


              // Mostrar Toastify al eliminar
              Toastify({
                text: "Usuario eliminado correctamente.",
                duration: 3000,
                close: false,
                gravity: "top",
                position: "center",
                backgroundColor:
                  "linear-gradient(to right,rgb(253, 42, 42),rgb(253, 42, 42))",
              }).showToast();
            } else {
              Swal.fire(
                "Error",
                "Hubo un error al eliminar el usuario.",
                "error"
              );
            }
          },
          error: function () {
            Swal.fire("Error", "Error al eliminar el usuario.", "error");
          },
        });
      }
    });
  });

  //MODAL VER DETALLES DEL USUARIO OK

  // Función para ver detalles del usuario
  $(document).on("click", ".view-btn", function () {
    var usuarioId = $(this).data("id");

    $.ajax({
      url: `/administradores/obtener_usuario/${usuarioId}/`,
      type: "GET",
      success: function (response) {
        if (response.status === "success") {
          const usuario = response.usuario;

          // Llenar los campos del modal
          $("#ver_first_name").text(usuario.first_name);
          $("#ver_last_name").text(usuario.last_name);
          $("#ver_username").text(usuario.username);
          $("#ver_tipo_usuario").text(usuario.tipo_usuario);
          $("#ver_especialidad").text(usuario.especialidad);
          $("#ver_email").text(usuario.email);
          $("#ver_is_active")
            .text(usuario.is_active)
            .removeClass("badge-activo badge-inactivo")
            .addClass(
              usuario.is_active === "ACTIVO" ? "badge-activo" : "badge-inactivo"
            );
          $("#ver_date_joined").text(usuario.date_joined);
          $("#ver_last_login").text(usuario.last_login);
          $("#ver_is_staff").text(usuario.is_staff);
          $("#ver_is_superuser").text(usuario.is_superuser);

          // Manejar la imagen
          if (usuario.image_url) {
            $("#ver_imagen").attr("src", usuario.image_url);
          } else {
            $("#ver_imagen").attr("src", "/static/img/default-profile.png");
          }

          // Mostrar el modal
          $("#verUsuarioModal").modal("show");
        } else {
          Toastify({
            text: "Error al cargar los datos del usuario",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          }).showToast();
        }
      },
    });
  });

  // AGREGAR NUEVO USUARIO OK
  $(document).ready(function () {
    $.validator.addMethod(
      "lettersOnly",
      function (value, element) {
        return (
          this.optional(element) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
        );
      },
      "Por favor, ingrese solo letras."
    );
    $.validator.addMethod(
      "usernameDisponible",
      function (value, element) {
        let isValid = false;
        $.ajax({
          url: "/administradores/validar_username_actualizar/",
          type: "POST",
          async: false,
          data: {
            username: value,
            usuario_id: $("#edit_usuarioId").val(),
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(), // Asegúrate de incluir el token CSRF
          },
          success: function (response) {
            isValid = !response.exists;
            if (response.exists) {
              $.validator.messages.usernameDisponible = response.message;
            }
          },
        });
        return isValid;
      },
      "Este nombre de usuario ya está registrado."
    );
    $("#formAddUsuario").validate({
      rules: {
        first_name: {
          required: true,
          lettersOnly: true,
          maxlength: 50,
          minlength: 3,
        },
        last_name: {
          required: true,
          lettersOnly: true,
          maxlength: 50,
          minlength: 3,
        },
        username: {
          required: true,
          maxlength: 50,
          minlength: 5,
          remote: {
            url: "/administradores/validar_username/", // URL para validar en el servidor
            type: "GET",
            data: {
              username: function () {
                return $("#username").val().trim(); // Obtén el valor del campo
              },
            },
          },
        },
        email: {
          required: true,
          email: true, // Validación específica para correos electrónicos
          minlength: 10,
        },
        password: {
          required: true,
          maxlength: 200,
        },
        tipo_usuario: {
          required: true,
        },
        especialidad: {
          required: true,
        },
        image: {
          required: true,
        },
      },
      messages: {
        first_name: {
          required: "Por favor, ingrese el nombre del usuario.",
          lettersOnly: "Por favor, ingrese solamente letras",
          maxlength: "El nombre no puede exceder los 50 caracteres.",
          minlength: "El nombre debe tener al menos 5 caracteres.",
        },
        last_name: {
          required: "Por favor, ingrese el apellido del usuario.",
          lettersOnly: "Por favor, ingrese solamente letras",
          maxlength: "El apellido no puede exceder los 50 caracteres.",
          minlength: "El apellido debe tener al menos 5 caracteres.",
        },
        username: {
          required: "Por favor, ingrese el nombre de usuario.",
          maxlength: "El nombre de usuario no puede exceder los 50 caracteres.",
          minlength: "El nombre de usuario debe tener al menos 5 caracteres.",
          remote: "El nombre de usuario ya existe. Por favor, elija otro.",
        },
        email: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo válido.",
          minlength: "El correo electrónico debe tener al menos 10 caracteres.",
        },
        password: {
          required: "Por favor, ingrese una contraseña.",
          maxlength: "La contraseña no puede exceder los 200 caracteres.",
        },
        tipo_usuario: {
          required: "Por favor, seleccione un tipo de usuario.",
        },
        especialidad: {
          required: "Por favor, seleccione una especialidad.",
        },
        image: {
          required: "Por favor, suba la imagen de perfil del usuario.",
        },
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.after(error);
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
          data: new FormData(form),
          processData: false,
          contentType: false,
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_usuarios").DataTable();
              table.row
                .add({
                  image: `<img src="${response.usuario.image}" alt="Imagen de usuario" style="width: 50px; height: 50px; border-radius: 50%;">`,
                  first_name: response.usuario.first_name,
                  last_name: response.usuario.last_name,
                  username: response.usuario.username,
                  tipo_usuario: response.usuario.tipo_usuario,
                  is_active: `
                    <span class="badge bg-success">
                      ACTIVO
                    </span>
                  `,
                  acciones: `
                    <a href="#" style="margin-right: 1px;" class="btn btn-primary btn-sm view-btn" data-id="${response.usuario.id}" data-bs-toggle="modal" data-bs-target="#verUsuarioModal"><i class="fas fa-eye"></i></a>
                    <a href="#" style="margin-right: 1px;" class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editIngresoUsuariosModal" data-id="${response.usuario.id}"><i class="bi bi-pencil-fill"></i></a>                    
                  `,
                })
                .draw(false);

              Toastify({
                text: "Usuario guardado correctamente",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();

              $("#formAddUsuario")[0].reset();
              $("#addIngresoUsuariosModal").modal("hide");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
              $("html").css("overflow", "auto");
            } else {
              alert(response.message || "Error al agregar el usuario.");
            }
          },
          error: function () {
            alert("Error al procesar la solicitud.");
          },
        });
      },
    });
  });

  // FUNCION PARA MOSTRAR MODAL CON DATOS AL DAR CLICK EN EL BOTON DE EDITAR OK
  $(document).on("click", ".edit-btn", function () {
    var usuarioId = $(this).data("id");
    editarUsuario(usuarioId);
  });

  //FUNCION PARA EDITAR USUARIO MODAL
  function editarUsuario(usuarioId) {
    $("#editIngresoUsuariosModal").modal("hide");
    $.ajax({
      url: "/administradores/obtener_usuario_edit/" + usuarioId + "/",
      method: "GET",
      success: function (data) {
        console.log("Datos recibidos:", data); // Para depuración
        console.log("ID del usuario a editar:", data.usuario.id); // Para depurar
        $("#edit_usuarioId").val(data.usuario.id);
        $("#edit_first_name").val(data.usuario.first_name);
        $("#edit_last_name").val(data.usuario.last_name);
        $("#edit_username").val(data.usuario.username);
        $("#edit_tipo_usuario").val(data.usuario.tipo_usuario);
        $("#edit_especialidad").val(data.usuario.especialidad);
        $("#edit_email").val(data.usuario.email);
        $("#edit_image").attr("src", data.usuario.image);
        $("#edit_is_active_usuarios_select").val(
          data.usuario.is_active ? "true" : "false"
        );
        // Limpiar el input file
        $("#edit_image_input").val("");

        $("#editIngresousuariosModal").modal("show");
      },
      error: function () {
        alert("Error al obtener los datos del usuario.");
      },
    });
  }

  // Agregar evento para previsualizar la nueva imagen OK
  $("#edit_image_input").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#edit_image").attr("src", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Agregar evento para previsualizar la nueva imagen OK
  $("#image_input").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#image").attr("src", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // ACTUALIZAR USUARIO FUNCION
  $(document).ready(function () {
    $.validator.addMethod(
      "lettersOnly",
      function (value, element) {
        return (
          this.optional(element) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
        );
      },
      "Por favor, ingrese solo letras."
    );
    $("#formEditUsuario").validate({
      rules: {
        first_name: {
          required: true,
          lettersOnly: true,
          maxlength: 50,
          minlength: 3,
        },
        last_name: {
          required: true,
          lettersOnly: true,
          maxlength: 50,
          minlength: 3,
        },
        username: {
          required: true,
          maxlength: 50,
          minlength: 5,
          usernameDisponible: true,
        },
        email: {
          required: true,
          email: true, // Validación específica para correos electrónicos
          minlength: 10,
        },
        password: {
          maxlength: 200,
        },
        tipo_usuario: {
          required: true,
        },
        especialidad: {
          required: true,
        },
      },
      messages: {
        first_name: {
          required: "Por favor, ingrese el nombre del usuario.",
          lettersOnly: "Por favor, ingrese solamente letras",
          maxlength: "El nombre no puede exceder los 50 caracteres.",
          minlength: "El nombre debe tener al menos 5 caracteres.",
        },
        last_name: {
          required: "Por favor, ingrese el apellido del usuario.",
          lettersOnly: "Por favor, ingrese solamente letras",
          maxlength: "El apellido no puede exceder los 50 caracteres.",
          minlength: "El apellido debe tener al menos 5 caracteres.",
        },
        username: {
          required: "Por favor, ingrese el nombre de usuario.",
          maxlength: "El nombre de usuario no puede exceder los 50 caracteres.",
          minlength: "El nombre de usuario debe tener al menos 5 caracteres.",
        },
        email: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo válido.",
          minlength: "El correo electrónico debe tener al menos 10 caracteres.",
        },
        password: {
          maxlength: "La contraseña no puede exceder los 200 caracteres.",
        },
        tipo_usuario: {
          required: "Por favor, seleccione un tipo de usuario.",
        },
        especialidad: {
          required: "Por favor, seleccione una especialidad.",
        },
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.after(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
      },
      submitHandler: function (form) {
        console.log("Enviando formulario...");
        console.log("ID de usuario:", $("#edit_usuarioId").val());
        console.log("Username:", $("#edit_username").val());
        // Enviar el formulario por AJAX si la validación es exitosa
        $.ajax({
          url: "/administradores/actualizar_usuario/", // URL de tu endpoint de actualización
          method: "POST",
          data: new FormData(form),
          processData: false,
          contentType: false,
          success: function (response) {
            console.log("Respuesta recibida:", response); // Verifica la respuesta del servidor
            console.log(new FormData(form));

            if (response.status === "success") {
              console.log("Usuario actualizado:", response.usuario);
              // Encuentra la fila afectada en el DataTable

              // Encuentra la fila correspondiente en el DataTable usando el ID del usuario
              
              let row = table
              .rows()
              .nodes()
              .to$()
              .filter(function () {
                return $(this).find(".edit-btn").data("id") === response.usuario.id;
              }); 

              console.log(
                "Estado activo recibido:",
                response.usuario.is_active
              );

              // Actualiza los datos en el DataTable
              table
                .row(row)
                .data({
                  image: `<img src="${response.usuario.image}" alt="Imagen de usuario" style="width: 50px; height: 50px; border-radius: 50%;">`,
                  first_name: response.usuario.first_name,
                  last_name: response.usuario.last_name,
                  username: response.usuario.username,
                  tipo_usuario: response.usuario.tipo_usuario.toUpperCase(), // Solo para visualización
                  is_active: response.usuario.is_active
                    ? '<span class="badge bg-success">ACTIVO</span>'
                    : '<span class="badge bg-danger">INACTIVO</span>',
                  acciones: `<div class="d-flex">
                                <a href="#" style="margin-right: 10px;" class="btn btn-primary btn-sm view-btn"
                                  data-id="${response.usuario.id}" data-bs-toggle="modal" data-bs-target="#verUsuarioModal">
                                  <i class="fas fa-eye"></i>
                                </a>
                                <a href="#" style="margin-right: 10px;" class="btn btn-sm btn-warning edit-btn"
                                  data-bs-toggle="modal" data-bs-target="#editIngresoUsuariosModal"
                                  data-id="${response.usuario.id}">
                                  <i class="bi bi-pencil-fill"></i>
                                </a>
                                
                            </div>`,
                })
                .draw(false);

              Toastify({
                text: "Usuario actualizado correctamente",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();

              // Cerrar el modal y limpiar el fondo negro
              $("#formEditUsuario")[0].reset();
              $("#editIngresoUsuariosModal").modal("hide");
              $(".modal-backdrop").remove(); // Elimina el fondo negro
              $("body").removeClass("modal-open"); // Quita la clase 'modal-open' del body
              $("html").css("overflow", "auto"); // Restaura el desbordamiento de la página
            } else {
              alert(response.message || "Error al actualizar el usuario.");
            }
          },
          error: function () {
            alert("Error al procesar la solicitud.");
          },
        });
      },
    });
  });


});
