$(document).ready(function () {
    // Mostrar/Ocultar contraseña
    $('#togglePassword').on('click', function () {
        var passwordField = $('#password');
        var passwordFieldType = passwordField.attr('type');
        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
            $(this).text('Ocultar');
        } else {
            passwordField.attr('type', 'password');
            $(this).text('Mostrar');
        }
    });

    // Mostrar/Ocultar confirmar contraseña
    $('#toggleConfirmPassword').on('click', function () {
        var confirmPasswordField = $('#confirm_password');
        var confirmPasswordFieldType = confirmPasswordField.attr('type');
        if (confirmPasswordFieldType === 'password') {
            confirmPasswordField.attr('type', 'text');
            $(this).text('Ocultar');
        } else {
            confirmPasswordField.attr('type', 'password');
            $(this).text('Mostrar');
        }
    });

    // Validar que las contraseñas coincidan
    $('#formaddUsuario').on('submit', function (e) {
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();
        if (password !== confirmPassword) {
            e.preventDefault();
            alert('Las contraseñas no coinciden.');
        }
    });
});