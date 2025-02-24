// Función para actualizar la hora
function updateTime() {
    // Crear un objeto Date para obtener la hora actual
    var now = new Date();

    // Obtener las horas y minutos actuales
    var hours = now.getHours();
    var minutes = now.getMinutes();

    // Si las horas o minutos tienen un solo dígito, agregar un cero delante
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Formatear la hora en el formato adecuado para el input tipo "time" (HH:MM)
    var timeString = hours + ':' + minutes;

    // Colocar la hora formateada en el campo de hora
    document.getElementById('hora_atencion_historial').value = timeString;
}

// Ejecutar la función updateTime cuando se cargue la página
window.onload = function() {
    updateTime(); // Establece la hora cuando se carga la página

    // Actualizar la hora cada minuto (60,000 milisegundos)
    setInterval(updateTime, 60000); // 60000 milisegundos = 1 minuto
};
