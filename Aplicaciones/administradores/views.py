from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
import pytz
from Aplicaciones.usuarios.models import Usuarios
from django.views.decorators.csrf import csrf_exempt

@login_required
def gestion_usuarios(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    usuarios = Usuarios.objects.all()  # Verifica que `Usuarios` es un modelo y no un módulo
    return render(request, 'administradores/gestion_usuarios.html',{'usuarios': usuarios})

#RENDERIZAR HOME DOCTORES
@login_required
def inicio_administrador(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    return render(request, 'administradores/inicio_administrador.html')


# Vista para obtener todos los datos de los usuarios

def obtener_usuarios(request):
    usuarios = Usuarios.objects.all().values(
        'id',  # Asegúrate de incluir el id
        'password',
        'last_login', 
        'is_superuser', 
        'username', 
        'first_name', 
        'last_name', 
        'email', 
        'is_staff',
        'is_active', 
        'date_joined',
        'tipo_usuario',
        'especialidad'        
    )
    return JsonResponse({'usuarios': list(usuarios)})

#Eliminar
@csrf_exempt  # Si tu configuración de CSRF está causando problemas (asegúrate de que se maneje correctamente)
@login_required
def eliminar_usuario(request, usuario_id):
    if request.method == 'DELETE':
        try:
            usuario = Usuarios.objects.get(id=usuario_id)
            usuario.delete()
            return JsonResponse({'status': 'success'})
        except Usuarios.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})


# Vista para agregar un nuevo usuario OK
@login_required
def agregar_usuario(request):
    if request.method == 'POST':
        tipo_usuario = request.POST.get('tipo_usuario', '').lower()  # Comparación insensible a mayúsculas/minúsculas

        # Configurar is_superuser e is_staff automáticamente
        if tipo_usuario == 'administrador':
            is_superuser = True
            is_staff = True
        else:
            is_superuser = False
            is_staff = False


        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        tipo_usuario = request.POST.get('tipo_usuario')
        especialidad = request.POST.get('especialidad')
        email = request.POST.get('email')
        password = request.POST.get('password')
        image = request.FILES.get('image')

        if not password:
            return JsonResponse({
                'status': 'error',
                'message': 'La contraseña no puede estar vacía'
            })

        usuario = Usuarios(
            first_name=first_name,
            last_name=last_name,
            username=username,
            tipo_usuario=tipo_usuario,
            especialidad=especialidad,
            email=email,
            is_superuser=is_superuser,
            is_staff=is_staff,
            image=image,
        )
        usuario.set_password(password)  # Encriptar contraseña
        usuario.save()

        return JsonResponse({
            'status': 'success',
            'message': 'Usuario agregado correctamente',
            'usuario': {
                'id': usuario.id,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'username': usuario.username,
                'tipo_usuario': usuario.tipo_usuario,
                'especialidad': usuario.especialidad,
                'email': usuario.email,
                'is_superuser': usuario.is_superuser,
                'is_staff': usuario.is_staff,
                'image': usuario.image.url if usuario.image else None,
                'date_joined': usuario.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                'last_login': usuario.last_login.strftime('%Y-%m-%d %H:%M:%S') if usuario.last_login else None,
            },
        })


#VISTA PARA CARGAR DATOS EN EL MODAL DE VER MÁS DETALLES
@login_required
def obtener_usuario(request, usuario_id):
    try:
        usuario = Usuarios.objects.get(id=usuario_id)
        
        ecuador_tz = pytz.timezone('America/Guayaquil')
        # Formatear fechas
        date_joined = usuario.date_joined.astimezone(ecuador_tz).strftime('%d/%m/%Y %H:%M')
        last_login = usuario.last_login.astimezone(ecuador_tz).strftime('%d/%m/%Y %H:%M') if usuario.last_login else "Nunca ha iniciado sesión"

        data = {
            'status': 'success',
            'usuario': {
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'username': usuario.username,
                'tipo_usuario': usuario.tipo_usuario,
                'especialidad': usuario.especialidad,
                'email': usuario.email,
                'is_active': 'ACTIVO' if usuario.is_active else 'INACTIVO',
                'image_url': usuario.image.url if usuario.image else None,
                'date_joined':date_joined,
                'last_login': last_login,
                'is_superuser': 'Si' if usuario.is_superuser else 'No',
                'is_staff': 'Si' if usuario.is_staff else 'No',
            }
        }
        return JsonResponse(data)
    except Usuarios.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'})
    
#VALIDAR USERNAME INGRESAR
def validar_username(request):
    username = request.GET.get('username', '').strip()
    if Usuarios.objects.filter(username=username).exists():
        return JsonResponse(False, safe=False)  # Username ya existe
    return JsonResponse(True, safe=False)  # Username disponible

@login_required
def validar_username_actualizar(request):
    username = request.POST.get('username')
    usuario_id = request.POST.get('usuario_id')

    try:
        if usuario_id:
            # Si se está editando, excluimos el usuario actual
            usuario = Usuarios.objects.exclude(id=usuario_id).filter(username=username).exists()
        else:
            # Si es nuevo usuario, verificamos en toda la base de datos
            usuario = Usuarios.objects.filter(username=username).exists()

        if usuario:
            return JsonResponse({'exists': True, 'message': 'Este nombre de usuario ya está registrado en el sistema.'})
        else:
            return JsonResponse({'exists': False})
    except Exception as e:
        return JsonResponse({'exists': False, 'message': str(e)})
#EDITAR USUARIO

# Vista para obtener los datos del usuario (para el modal)
@login_required
def obtener_usuario_edit(request, usuario_id):
    try:
        print(f"Buscando usuario con id: {usuario_id}") 
        usuario = Usuarios.objects.get(id=usuario_id)        
        # Si existe el usuario, enviar los datos en formato JSON
        return JsonResponse({
            'usuario': {
                'id': usuario.id,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'username': usuario.username,
                'email': usuario.email,
                'tipo_usuario': usuario.tipo_usuario,
                'especialidad': usuario.especialidad,
                'image': usuario.image.url if usuario.image else None,      
                'is_active' : usuario.is_active           
            }
        })
    except Usuarios.DoesNotExist:
        return JsonResponse({'error': 'usuario no encontrado'}, status=404)
    



@login_required
def actualizar_usuario(request):
    if request.method == 'POST':
        usuario_id = request.POST.get('id')
        try:
            usuario = Usuarios.objects.get(id=usuario_id)
            
            # Actualizar los campos básicos
            usuario.first_name = request.POST.get('first_name', usuario.first_name)
            usuario.last_name = request.POST.get('last_name', usuario.last_name)
            usuario.username = request.POST.get('username', usuario.username)
            usuario.tipo_usuario = request.POST.get('tipo_usuario', usuario.tipo_usuario)
            usuario.especialidad = request.POST.get('especialidad', usuario.especialidad)
            usuario.email = request.POST.get('email', usuario.email)
            password = request.POST.get('password')  # Obtener la nueva contraseña
            # Verifica si la contraseña fue proporcionada
            if password:
                password = make_password(password)  # Encripta la contraseña
            if password:
                usuario.password = password  # Si hay una nueva contraseña, actualízala
            # Manejar la nueva imagen si se proporciona
            if request.FILES.get('image'):
                usuario.image = request.FILES['image']
        
            # Manejo del estado activo/inactivo
            is_active_value = request.POST.get('is_active',None)
            print(f"Valor recibido de is_active: {is_active_value}")  # Verifica si el valor está llegando correctamente

            if is_active_value == 'true':
                usuario.is_active = True
            elif is_active_value == 'false':
                usuario.is_active = False
            else:   
                # Si el valor no es válido, podrías devolver un error
                usuario.is_active = usuario.is_active

            usuario.save()

            response_data = {
                'status': 'success',
                'message': 'Usuario actualizado correctamente',
                'usuario': {
                    'id': usuario.id,
                    'first_name': usuario.first_name,
                    'last_name': usuario.last_name,
                    'username': usuario.username,
                    'email': usuario.email,
                    'tipo_usuario': usuario.tipo_usuario,
                    'especialidad': usuario.especialidad,
                    'image': usuario.image.url if usuario.image else None,
                    'is_active': usuario.is_active
                }
            }
            return JsonResponse(response_data)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': f'Error al actualizar: {str(e)}'})
            
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})