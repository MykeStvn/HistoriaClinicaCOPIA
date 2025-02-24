if (window.history && window.history.pushState) {
    // Reemplaza el estado actual para mantener la URL constante
    window.history.replaceState(null, '', window.location.href);

    // Escucha el evento de navegación hacia atrás
    window.onpopstate = function () {
        // Reemplaza el estado de nuevo para evitar regresar
        window.history.replaceState(null, '', window.location.href);
    };
}
