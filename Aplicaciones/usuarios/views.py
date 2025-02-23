
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse

from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            print(f"Usuario autenticado: {user.username}, tipo de usuario: {user.tipo_usuario}")  # Depuración
            return redirect(reverse('usuarios:welcome'))  # Redirigir a la vista de bienvenida
        else:
            print("Credenciales inválidas")  # Esto se imprimirá en la consola
            return render(request, 'registration/login.html', {'error': 'Credenciales inválidas'})

    return render(request, 'registration/login.html')

def welcome_view(request):
    if request.user.is_authenticated:  # Asegúrate de que el usuario esté autenticado
        # Determina la URL de redirección según el tipo de usuario
        if request.user.tipo_usuario == 'doctor':
            redirect_url = 'gestion_pacientes:inicio_doctor'
        elif request.user.tipo_usuario == 'admisionista':
            redirect_url = 'admisionistas:ingreso_pacientes'
        elif request.user.tipo_usuario == 'administrador':
            redirect_url = 'administradores:inicio_administrador'  #REDIRECCIONAR A LA PARTE DE ADMINISTRADOR POR EL MOMENTO MANEJAMOS AL LOGIN
        else:
            redirect_url = '/'  # Redirigir a la página de inicio si no es doctor ni admisionista

        return render(request, 'welcome.html', {'redirect_url': redirect_url})  # Pasa la URL a la plantilla
    else:
        return redirect('usuarios:login')  # Redirigir a la página de inicio de sesión si no está autenticado

def logout_view(request):
    logout(request)  # Cierra la sesión del usuario
    return redirect('usuarios:login')  # Redirige a la página de inicio de sesión