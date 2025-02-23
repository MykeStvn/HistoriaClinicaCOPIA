from datetime import date, datetime
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from Aplicaciones.admisionistas.models import Pacientes, Citas
from Aplicaciones.usuarios.models import Usuarios
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from datetime import date
from django.db import connection
#from django.db.models import Count
from django.utils import timezone  # Para obtener la fecha y hora actual del servidor



# Vista para buscar pacientes por cédula OK
@login_required
def buscar_pacientes(request):
    fecha_maxima = date.today()  # Fecha máxima actual (o ajusta según tus necesidades) 
    pacientes = None  # Inicializa como None para distinguir el estado inicial
    query = request.GET.get('cedula_pacientes')  # Obtén el parámetro de búsqueda desde la solicitud

    #SI HAY UNA BUSQUEDA POR CÉDULA SE MUESTRA SOLO ESE REGISTRO 
    if query:  # Si hay una búsqueda
        pacientes = Pacientes.objects.filter(cedula_pacientes=query)
        for paciente in pacientes:
            paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)

    return render(request, 'admisionistas/ingreso_pacientes.html', {'pacientes': pacientes, 'fecha_maxima': fecha_maxima})

# Vista para ingresar a la pagina de pacientes OK
@login_required
def ingreso_pacientes(request):
    if request.user.tipo_usuario not in ['admisionista', 'administrador']:
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es admisionista
    
    #LINEAS COMENTADAS YA QUE AL RENDERIZAR LA PAGINA NO NECESITAMOS QUE CARGUE TODOS LOS OBJETOS DE PACIENTES
    # pacientesBdd = Pacientes.objects.all()
    # for paciente in pacientesBdd:
    #     paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)
    
    admisionistas = Usuarios.objects.filter(tipo_usuario='admisionista')
    fecha_maxima = date.today().strftime('%Y-%m-%d')  # Fecha actual en formato YYYY-MM-DD
    #return render(request, 'admisionistas/ingreso_pacientes.html', {'pacientes': pacientesBdd, 'usuarios': admisionistas})    
    return render(request, 'admisionistas/ingreso_pacientes.html', {'usuarios': admisionistas, 'fecha_maxima': fecha_maxima})



# Vista para agregar un nuevo paciente OK
@login_required
def agregar_paciente(request):
    if request.method == 'POST':
        # Recoger los datos del paciente
        apellido_paterno_pacientes = request.POST.get('apellido_paterno_pacientes')
        apellido_materno_pacientes = request.POST.get('apellido_materno_pacientes')
        nombres_pacientes = request.POST.get('nombres_pacientes')
        cedula_pacientes = request.POST.get('cedula_pacientes')
        fecha_nacimiento_pacientes = request.POST.get('fecha_nacimiento_pacientes')
        lugar_nacimiento_pacientes = request.POST.get('lugar_nacimiento_pacientes')
        nacionalidad_pacientes = request.POST.get('nacionalidad_pacientes')
        grupo_cultural_pacientes = request.POST.get('grupo_cultural_pacientes')
        direccion_pacientes = request.POST.get('direccion_pacientes')
        email_pacientes = request.POST.get('email_pacientes')
        telefono_pacientes = request.POST.get('telefono_pacientes')
        estado_civil_pacientes = request.POST.get('estado_civil_pacientes')
        genero_pacientes = request.POST.get('genero_pacientes')
        # Si el género es "Otro", usa el valor ingresado por el usuario
        if genero_pacientes == 'Otro':
            genero_pacientes = request.POST.get('genero_otro')
        instruccion_academica_pacientes = request.POST.get('instruccion_academica_pacientes')
        ocupacion_pacientes = request.POST.get('ocupacion_pacientes')
        empresa_trabaja_pacientes = request.POST.get('empresa_trabaja_pacientes')
        seguro_pacientes = request.POST.get('seguro_pacientes')
        if seguro_pacientes == 'Otro':
            seguro_pacientes = request.POST.get('seguro_otro')
        emergencia_informar_pacientes = request.POST.get('emergencia_informar_pacientes')
        parentesco_pacientes = request.POST.get('parentesco_pacientes')
        contacto_emergencia_pacientes = request.POST.get('contacto_emergencia_pacientes')
        is_active = request.POST.get('is_active', 'true').lower() == 'true'  # Activo por defecto
        # Cálculo de la edad
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_pacientes, "%Y-%m-%d").date()
        edad_paciente = calculate_age(fecha_nacimiento)

        # Obtener el admisionista (usuario autenticado)
        admisionista = request.user

        # Crear el paciente
        paciente = Pacientes.objects.create(
            apellido_paterno_pacientes=apellido_paterno_pacientes,
            apellido_materno_pacientes=apellido_materno_pacientes,
            nombres_pacientes=nombres_pacientes,
            cedula_pacientes=cedula_pacientes,
            fecha_nacimiento_pacientes=fecha_nacimiento_pacientes,
            lugar_nacimiento_pacientes = lugar_nacimiento_pacientes,
            nacionalidad_pacientes = nacionalidad_pacientes,
            grupo_cultural_pacientes = grupo_cultural_pacientes,
            direccion_pacientes=direccion_pacientes,
            email_pacientes=email_pacientes,
            telefono_pacientes=telefono_pacientes,
            estado_civil_pacientes = estado_civil_pacientes,
            genero_pacientes=genero_pacientes,
            instruccion_academica_pacientes = instruccion_academica_pacientes,
            ocupacion_pacientes = ocupacion_pacientes,
            empresa_trabaja_pacientes = empresa_trabaja_pacientes,
            seguro_pacientes=seguro_pacientes,
            emergencia_informar_pacientes=emergencia_informar_pacientes,
            parentesco_pacientes = parentesco_pacientes,
            contacto_emergencia_pacientes=contacto_emergencia_pacientes,
            fk_id_admisionista=admisionista, # Asignar el usuario autenticado como admisionista,
            is_active=is_active
        )

        # Enviar la respuesta con los datos del paciente y la edad calculada
        return JsonResponse({'status': 'success', 'message': 'Paciente agregado correctamente', 'paciente': {
            'id_pacientes': paciente.id_pacientes,
            'apellido_paterno': paciente.apellido_paterno_pacientes,
            'apellido_materno': paciente.apellido_materno_pacientes,
            'nombres': paciente.nombres_pacientes,
            'cedula': paciente.cedula_pacientes,
            'fecha_nacimiento': paciente.fecha_nacimiento_pacientes,
            'edad': edad_paciente,
            'lugar_nacimiento': paciente.lugar_nacimiento_pacientes,
            'nacionalidad': paciente.nacionalidad_pacientes,
            'grupo_cultural': paciente.grupo_cultural_pacientes,
            'direccion': paciente.direccion_pacientes,
            'email': paciente.email_pacientes,
            'telefono': paciente.telefono_pacientes,
            'estado_civil': paciente.estado_civil_pacientes,
            'genero': paciente.genero_pacientes,
            'instruccion_academica': paciente.instruccion_academica_pacientes,
            'ocupacion': paciente.ocupacion_pacientes,
            'empresa_trabaja': paciente.empresa_trabaja_pacientes,
            'seguro': paciente.seguro_pacientes,
            'emergencia_informar': paciente.emergencia_informar_pacientes,
            'parentesco': paciente.parentesco_pacientes,
            'contacto_emergencia': paciente.contacto_emergencia_pacientes,
            'admisionista': paciente.fk_id_admisionista.username,  # Mostrar el nombre del admisionista
            'is_active': paciente.is_active
        }})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

# Vista para obtener los datos del paciente (para el modal)
@login_required
def obtener_paciente(request, paciente_id):
    try:
        print(f"Buscando paciente con id: {paciente_id}") 
        paciente = Pacientes.objects.get(id_pacientes=paciente_id)
        edad = calculate_age(paciente.fecha_nacimiento_pacientes)
        # Si existe el paciente, enviar los datos en formato JSON
        return JsonResponse({
            'paciente': {
                'id_pacientes': paciente.id_pacientes,
                'apellido_paterno': paciente.apellido_paterno_pacientes,
                'apellido_materno': paciente.apellido_materno_pacientes,
                'nombres': paciente.nombres_pacientes,
                'cedula': paciente.cedula_pacientes,
                'fecha_nacimiento': paciente.fecha_nacimiento_pacientes,
                'edad': edad,
                'lugar_nacimiento': paciente.lugar_nacimiento_pacientes,
                'nacionalidad': paciente.lugar_nacimiento_pacientes,
                'grupo_cultural': paciente.grupo_cultural_pacientes,
                'direccion': paciente.direccion_pacientes,
                'email': paciente.email_pacientes,
                'telefono': paciente.telefono_pacientes,
                'estado_civil': paciente.estado_civil_pacientes,
                'genero': paciente.genero_pacientes,
                'instruccion_academica': paciente.instruccion_academica_pacientes,
                'ocupacion':paciente.ocupacion_pacientes,
                'empresa_trabaja':paciente.empresa_trabaja_pacientes,
                'seguro': paciente.seguro_pacientes,
                'emergencia_informar': paciente.emergencia_informar_pacientes,
                'parentesco': paciente.parentesco_pacientes,
                'contacto_emergencia': paciente.contacto_emergencia_pacientes,
                'genero_otro': paciente.genero_otro if paciente.genero_pacientes == 'Otro' else None,
                'seguro_otro': paciente.seguro_otro if paciente.seguro_pacientes == 'Otro' else None,
                'admisionista': paciente.fk_id_admisionista.username if paciente.fk_id_admisionista else None,
                'is_active' : paciente.is_active 
            }
        })
    except Pacientes.DoesNotExist:
        return JsonResponse({'error': 'Paciente no encontrado'}, status=404)
    
# Vista para actualizar un paciente
@login_required
def actualizar_paciente(request):
    if request.method == 'POST':
        paciente_id = request.POST.get('id_pacientes')
        try:
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)

            # Actualizar los campos con validaciones
            paciente.apellido_paterno_pacientes = request.POST.get('apellido_paterno_pacientes', paciente.apellido_paterno_pacientes)
            paciente.apellido_materno_pacientes = request.POST.get('apellido_materno_pacientes', paciente.apellido_materno_pacientes)
            paciente.nombres_pacientes = request.POST.get('nombres_pacientes', paciente.nombres_pacientes)
            paciente.cedula_pacientes = request.POST.get('cedula_pacientes', paciente.cedula_pacientes)
            paciente.direccion_pacientes = request.POST.get('direccion_pacientes', paciente.direccion_pacientes)
            paciente.email_pacientes = request.POST.get('email_pacientes', paciente.email_pacientes)
            paciente.estado_civil_pacientes = request.POST.get('estado_civil_pacientes', paciente.estado_civil_pacientes)
            paciente.lugar_nacimiento_pacientes = request.POST.get('lugar_nacimiento_pacientes', paciente.lugar_nacimiento_pacientes)
            paciente.nacionalidad_pacientes = request.POST.get('nacionalidad_pacientes', paciente.nacionalidad_pacientes)
            paciente.grupo_cultural_pacientes = request.POST.get('grupo_cultural_pacientes', paciente.grupo_cultural_pacientes)
            paciente.instruccion_academica_pacientes = request.POST.get('instruccion_academica_pacientes', paciente.instruccion_academica_pacientes)
            paciente.ocupacion_pacientes = request.POST.get('ocupacion_pacientes', paciente.ocupacion_pacientes)
            paciente.empresa_trabaja_pacientes = request.POST.get('empresa_trabaja_pacientes', paciente.empresa_trabaja_pacientes)
            paciente.parentesco_pacientes = request.POST.get('parentesco_pacientes', paciente.parentesco_pacientes)

            # Manejo del género
            genero = request.POST.get('genero_pacientes')
            paciente.genero_pacientes = request.POST.get('genero_otro') if genero == 'Otro' else genero

            paciente.telefono_pacientes = request.POST.get('telefono_pacientes', paciente.telefono_pacientes)
            paciente.emergencia_informar_pacientes = request.POST.get('emergencia_informar_pacientes', paciente.emergencia_informar_pacientes)
            paciente.contacto_emergencia_pacientes = request.POST.get('contacto_emergencia_pacientes', paciente.contacto_emergencia_pacientes)

            # Manejo del seguro
            seguro = request.POST.get('seguro_pacientes')
            paciente.seguro_pacientes = request.POST.get('seguro_otro') if seguro == 'Otro' else seguro

            # Manejo de la fecha de nacimiento
            fecha_nacimiento_str = request.POST.get('fecha_nacimiento_pacientes')
            if fecha_nacimiento_str:  
                try:
                    paciente.fecha_nacimiento_pacientes = datetime.strptime(fecha_nacimiento_str, '%Y-%m-%d').date()
                except ValueError:
                    try:
                        paciente.fecha_nacimiento_pacientes = datetime.strptime(fecha_nacimiento_str, '%d/%m/%Y').date()
                    except ValueError:
                        return JsonResponse({'status': 'error', 'message': 'Formato de fecha inválido. Use AAAA-MM-DD o DD/MM/AAAA'})
            else:
                paciente.fecha_nacimiento_pacientes = None  
            # Manejo del estado activo/inactivo
            is_active_value = request.POST.get('is_active',None)
            print(f"Valor recibido de is_active: {is_active_value}")  # Verifica si el valor está llegando correctamente

            if is_active_value == 'true':
                paciente.is_active = True
            elif is_active_value == 'false':
                paciente.is_active = False
            else:   
                # Si el valor no es válido, podrías devolver un error
                paciente.is_active = paciente.is_active
            
            paciente.save()
        
            # Calcular la edad si hay fecha de nacimiento
            edad = calculate_age(paciente.fecha_nacimiento_pacientes) if paciente.fecha_nacimiento_pacientes else None

            # Construir la respuesta JSON
            response_data = {
                'status': 'success',
                'message': 'Paciente actualizado correctamente',
                'paciente': {
                    'id_pacientes': paciente.id_pacientes,
                    'apellido_paterno': paciente.apellido_paterno_pacientes,
                    'apellido_materno': paciente.apellido_materno_pacientes,
                    'nombres': paciente.nombres_pacientes,
                    'cedula': paciente.cedula_pacientes,
                    'fecha_nacimiento': paciente.fecha_nacimiento_pacientes.strftime('%Y-%m-%d') if paciente.fecha_nacimiento_pacientes else None,
                    'edad': edad,
                    'lugar_nacimiento': paciente.lugar_nacimiento_pacientes,
                    'nacionalidad': paciente.nacionalidad_pacientes,
                    'grupo_cultural': paciente.grupo_cultural_pacientes,
                    'direccion': paciente.direccion_pacientes,
                    'email': paciente.email_pacientes,
                    'telefono': paciente.telefono_pacientes,
                    'estado_civil': paciente.estado_civil_pacientes,
                    'genero': paciente.genero_pacientes,
                    'instruccion_academica': paciente.instruccion_academica_pacientes,
                    'ocupacion': paciente.ocupacion_pacientes,
                    'empresa_trabaja': paciente.empresa_trabaja_pacientes,
                    'seguro': paciente.seguro_pacientes,
                    'emergencia_informar': paciente.emergencia_informar_pacientes,
                    'parentesco': paciente.parentesco_pacientes,
                    'contacto_emergencia': paciente.contacto_emergencia_pacientes,
                    'admisionista': paciente.fk_id_admisionista.username,
                    'is_active': paciente.is_active
                }
            }
            return JsonResponse(response_data)

        except Pacientes.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Paciente no encontrado'})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': f'Error al actualizar: {str(e)}'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

#Vista para Eliminar un paciente
@csrf_exempt  # Si tu configuración de CSRF está causando problemas (asegúrate de que se maneje correctamente)
@login_required
def eliminar_paciente(request, paciente_id):
    if request.method == 'DELETE':
        try:
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)
            paciente.delete()
            return JsonResponse({'status': 'success'})
        except Pacientes.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Paciente no encontrado'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})


#validación cédula ECUATORIANA
# Función para validar el dígito verificador de la cédula
def validar_cedula(cedula):
    # Validar longitud
    if len(cedula) != 10:
        return False
    
    # Validar los dos primeros dígitos (provincia) [01-24]
    provincia = int(cedula[:2])
    if provincia < 1 or provincia > 24:
        return False
    
    # Validar el tercer dígito [0-5]
    tercer_digito = int(cedula[2])
    if tercer_digito < 0 or tercer_digito > 5:
        return False

    # Coeficientes para el cálculo del dígito verificador
    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    suma = 0

    # Multiplicar cada dígito de la cédula por su coeficiente y ajustar si es mayor o igual a 10
    for i in range(9):
        resultado = int(cedula[i]) * coeficientes[i]
        if resultado >= 10:
            resultado -= 9
        suma += resultado

    # Calcular la decena superior de la suma
    decena_superior = (suma // 10 + 1) * 10

    # Calcular el dígito verificador
    digito_verificador = decena_superior - suma

    # Verificar si el dígito verificador coincide con el décimo dígito
    return digito_verificador == int(cedula[9])

#verifico cédula INGRESAR
@login_required
def verificar_cedula(request):
    if request.method == 'POST':
        cedula = request.POST.get('cedula_pacientes')  # Campo esperado del formulario
        # Validación de la cédula
        if not validar_cedula(cedula):
            return JsonResponse({'exists': True, 'valid': False, 'message': 'Cédula inválida'})
        # Verificar si la cédula existe en la base de datos
        exists = Pacientes.objects.filter(cedula_pacientes=cedula).exists()
        return JsonResponse({'exists': exists})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

#verifico cedula ACTUALIZAR
@login_required
def verificar_cedula_actualizar(request):
        cedula = request.POST.get('cedula_pacientes')
        paciente_id = request.POST.get('paciente_id')  # Obtener el ID del paciente (si estamos editando)

        # Primero, validamos que la cédula sea ecuatoriana utilizando la función validar_cedula
        if not validar_cedula(cedula):
            return JsonResponse({'exists': True, 'message': 'La cédula debe ser ecuatoriana válida (10 dígitos).'})
        
        # Verificar si la cédula ya está registrada en otro paciente, excluyendo el paciente actual si está editando
        try:
            if paciente_id:
                # Si se está editando, excluimos el paciente con ese ID
                paciente = Pacientes.objects.exclude(id_pacientes=paciente_id).filter(cedula_pacientes=cedula).exists()
            else:
                # Si no se está editando, verificamos en toda la base de datos
                paciente = Pacientes.objects.filter(cedula_pacientes=cedula).exists()

            if paciente:
                return JsonResponse({'exists': True, 'message': 'Esta cédula ya está registrada en el sistema o no es ecuatoriana.'})
            else:
                return JsonResponse({'exists': False})
        except Exception as e:
            return JsonResponse({'exists': False, 'message': str(e)})


# Función para calcular la edad
def calculate_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


#ASIGNAR CITAS DIARIAS
@login_required
def registro_citas(request):
    # Permitir acceso solo a usuarios que sean admisionistas o administradores
    if request.user.tipo_usuario not in ['admisionista', 'administrador']:
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no tiene permisos
    
    admisionistas = Usuarios.objects.filter(tipo_usuario='admisionista')
    fecha_maxima = date.today().strftime('%Y-%m-%d')  # Fecha actual en formato YYYY-MM-DD
    return render(request, 'admisionistas/registro_citas.html', {'usuarios': admisionistas, 'fecha_maxima': fecha_maxima})
#registro automatico de cita solo dando clic en el botón
@login_required
def registrar_cita(request):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # Obtener los datos del formulario
        estado_cita = request.POST.get("estado_cita", "PENDIENTE")  # Valor predeterminado
        fk_id_paciente = request.POST.get("fk_id_paciente")

        # Validar el ID del paciente
        if not fk_id_paciente:
            return JsonResponse({'error': 'El ID del paciente no puede estar vacío.'}, status=400)

        try:
            paciente_id = int(fk_id_paciente)
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)
        except ValueError:
            return JsonResponse({'error': 'ID de paciente inválido.'}, status=400)
        except Pacientes.DoesNotExist:
            return JsonResponse({'error': 'El paciente no existe.'}, status=404)

        # Obtener la fecha y hora actual del sistema en la zona horaria configurada
        fecha_cita = timezone.localtime(timezone.now()).date()  # Fecha actual
        hora_cita = timezone.localtime(timezone.now()).strftime('%H:%M')  # Hora actual

        try:
            # Crear una nueva cita con la fecha y hora actuales
            nueva_cita = Citas(
                fecha_cita=fecha_cita,
                hora_cita=hora_cita,
                estado_cita=estado_cita,
                fk_id_paciente=paciente
            )
            nueva_cita.save()

            # Respuesta de éxito
            return JsonResponse({'success': 'Cita registrada correctamente.'}, status=201)

        except Exception as e:
            # Capturar errores no esperados
            return JsonResponse({'error': f'Ocurrió un error al registrar la cita: {str(e)}'}, status=500)

    # Si no es una solicitud POST o AJAX
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# listar citas
@login_required
def cargar_citas(request):
    """Carga las citas del día actual en formato JSON para DataTables."""
    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        fecha_actual = date.today()  # Obtener la fecha actual
        citas = Citas.objects.select_related('fk_id_paciente').filter(fecha_cita=fecha_actual)  # Filtrar por fecha actual

        data = []
        for cita in citas:
            data.append({
                #'id_cita': cita.id_cita,
                'apellido_paterno_pacientes': cita.fk_id_paciente.apellido_paterno_pacientes,
                'apellido_materno_pacientes': cita.fk_id_paciente.apellido_materno_pacientes,
                'nombres_pacientes': cita.fk_id_paciente.nombres_pacientes,
                'cedula_pacientes': cita.fk_id_paciente.cedula_pacientes,
                'fecha_cita': cita.fecha_cita.strftime('%Y-%m-%d'),
                'hora_cita': cita.hora_cita.strftime('%H:%M'),
                'estado_cita': cita.estado_cita,
                'acciones': f'<button class="btn btn-danger btn-sm eliminar-cita" data-id="{cita.id_cita}"><i class="bi bi-trash-fill"></i></button>'
            })
        return JsonResponse({'data': data}, status=200)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# # eliminar citas
# @login_required
# @csrf_exempt
# def eliminar_cita(request, id_cita):
#     """Elimina una cita médica específica."""
#     if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
#         try:
#             cita = Citas.objects.get(id_cita=id_cita)
#             cita.delete()
#             return JsonResponse({'success': 'Cita eliminada correctamente.'}, status=200)
#         except Citas.DoesNotExist:
#             return JsonResponse({'error': 'Cita no encontrada.'}, status=404)
#     return JsonResponse({'error': 'Método no permitido.'}, status=405)

#ELIMINAR CITAS
@login_required
@csrf_exempt
def eliminar_cita(request, id_cita):
    """Elimina una cita médica específica si su estado lo permite."""
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            cita = Citas.objects.get(id_cita=id_cita)

            # Bloquear eliminación si el estado es CANCELADA o COMPLETADA
            if cita.estado_cita.strip().upper() in ['CANCELADO', 'COMPLETADO']:
                return JsonResponse({'error': 'No se puede eliminar una cita con estado CANCELADA o COMPLETADA.'}, status=403)

            cita.delete()
            return JsonResponse({'success': 'Cita eliminada correctamente.'}, status=200)

        except Citas.DoesNotExist:
            return JsonResponse({'error': 'Cita no encontrada.'}, status=404)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)




#Historial Citas
#Vista para cargar historial_citas.html
@login_required
def historial_citas(request):
    if request.user.tipo_usuario not in ['admisionista', 'administrador']:
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es admisionista
    
    admisionistas = Usuarios.objects.filter(tipo_usuario='admisionista')
    fecha_maxima = date.today().strftime('%Y-%m-%d')  # Fecha actual en formato YYYY-MM-DD
    return render(request, 'admisionistas/historial_citas.html', {'usuarios': admisionistas, 'fecha_maxima': fecha_maxima})

# listar historial citas
@login_required
def cargar_historial_citas(request):
    """Carga las citas en formato JSON para DataTables."""
    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        citas = Citas.objects.select_related('fk_id_paciente').all()  # Asegúrate de tener relaciones definidas correctamente
        data = []
        for cita in citas:
            data.append({
                'apellido_paterno_pacientes': cita.fk_id_paciente.apellido_paterno_pacientes,
                'apellido_materno_pacientes': cita.fk_id_paciente.apellido_materno_pacientes,
                'nombres_pacientes': cita.fk_id_paciente.nombres_pacientes,
                'cedula_pacientes': cita.fk_id_paciente.cedula_pacientes,
                'fecha_cita': cita.fecha_cita.strftime('%Y-%m-%d'),
                'hora_cita': cita.hora_cita.strftime('%H:%M'),
            })
        return JsonResponse({'data': data}, status=200)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

#verificar el estado de las citas
def verificar_estado_cita(request, id_cita):
    try:
        cita = Citas.objects.get(id_cita=id_cita)
        return JsonResponse({'estado_cita': cita.estado_cita})
    except Citas.DoesNotExist:
        return JsonResponse({'error': 'Cita no encontrada'}, status=404)

#cancelar citas
@csrf_exempt
def cancelar_cita(request, id_cita):
    if request.method == 'POST':
        motivo = request.POST.get('motivo_cancelacion', '').strip()  # Obtener el motivo desde el formulario
        cita = get_object_or_404(Citas, id_cita=id_cita)

        # Verificar si el estado de la cita es 'PENDIENTE'
        if cita.estado_cita.upper() != "PENDIENTE":
            return JsonResponse({"error": "Solo puedes cancelar citas en estado PENDIENTE."}, status=400)

        # Actualizar el estado de la cita y agregar el motivo de cancelación
        cita.estado_cita = "CANCELADO"
        cita.motivo_cancelacion = motivo  # Guardar el motivo de cancelación
        cita.save()

        return JsonResponse({"success": "Cita cancelada exitosamente."})

    return JsonResponse({"error": "Método no permitido"}, status=405)



#dashboard
@login_required
def dashboard_citas(request):
    fecha_actual = date.today()

    # Consulta SQL cruda para contar las citas por estado
    query = """
        SELECT estado_cita, COUNT(*) 
        FROM citas 
        WHERE fecha_cita = %s 
        GROUP BY estado_cita;
    """

    # Ejecutar la consulta
    with connection.cursor() as cursor:
        cursor.execute(query, [fecha_actual])
        conteo_citas = cursor.fetchall()  # Obtiene los resultados como una lista de tuplas

    # Inicializar contadores en 0
    citas_pendientes = 0
    citas_canceladas = 0
    citas_completadas = 0

    # Procesar resultados
    for estado, total in conteo_citas:
        estado = estado.strip().lower()  # Convertimos a minúsculas y eliminamos espacios extra
        if estado == 'pendiente':
            citas_pendientes = total
        elif estado == 'cancelado':
            citas_canceladas = total
        elif estado == 'completado':
            citas_completadas = total

    # Debugging para verificar valores
    print(f"Pendientes: {citas_pendientes}")
    print(f"Canceladas: {citas_canceladas}")
    print(f"Completadas: {citas_completadas}")

    context = {
        'PENDIENTE': citas_pendientes,
        'CANCELADA': citas_canceladas,
        'COMPLETADA': citas_completadas
    }

    return render(request, 'admisionistas/dashboard.html', context)