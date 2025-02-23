from django.utils import timezone
from datetime import date, datetime
import pytz  # Importa pytz directamente
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse

from Aplicaciones.usuarios.models import Usuarios
from Aplicaciones.admisionistas.models import Citas, Pacientes
from Aplicaciones.gestion_pacientes.models import HistorialClinico

@login_required
def manejo_pacientes(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')
    return render(request, 'gestion_pacientes/manejo_pacientes.html')

@login_required
def inicio_doctor(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')
    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    return render(request, 'gestion_pacientes/inicio_doctor.html', {'usuarios': doctores})

@login_required
def citas(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')
    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    return render(request, 'gestion_pacientes/citas.html', {'usuarios': doctores})

@login_required
def cargar_citas(request):
    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        fecha_actual = date.today()
        citas = Citas.objects.select_related('fk_id_paciente').filter(fecha_cita=fecha_actual)

        data = []
        for cita in citas:
            acciones_html = (
                f'<a href="{reverse("gestion_pacientes:registro_cita", kwargs={"id_cita": cita.id_cita})}" '
                f'class="btn btn-success btn-sm registrar-cita" title="Registrar">'
                f'<i class="bi bi-check-circle-fill"></i></a>'
                f'<button class="btn btn-danger btn-sm cancelar-cita" data-id="{cita.id_cita}" title="Cancelar">'
                f'<i class="bi bi-x-circle-fill"></i></button>'
            )

            data.append({
                'apellido_paterno_pacientes': cita.fk_id_paciente.apellido_paterno_pacientes,
                'apellido_materno_pacientes': cita.fk_id_paciente.apellido_materno_pacientes,
                'nombres_pacientes': cita.fk_id_paciente.nombres_pacientes,
                'cedula_pacientes': cita.fk_id_paciente.cedula_pacientes,
                'fecha_cita': cita.fecha_cita.strftime('%Y-%m-%d'),
                'hora_cita': cita.hora_cita.strftime('%H:%M'),
                'estado_cita': cita.estado_cita,
                'acciones': acciones_html,
            })

        return JsonResponse({'data': data}, status=200)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

#registrar cita
@login_required
def registro_cita(request, id_cita):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')

    cita = get_object_or_404(Citas.objects.select_related('fk_id_paciente'), id_cita=id_cita)

    if cita.estado_cita in ['CANCELADO', 'COMPLETADO']:
        return redirect('gestion_pacientes:citas')

    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    doctor = request.user

    if request.method == 'POST':
        # Obtener la fecha y hora de atención del formulario
        fecha_atencion = request.POST.get('fecha_atencion_historial')
        hora_atencion = request.POST.get('hora_atencion_historial')

        # Si no se especificó hora, usamos la hora actual del dispositivo
        if not hora_atencion:
            hora_atencion = timezone.localtime(timezone.now()).strftime('%H:%M')  # Hora actual

        # Combinamos fecha y hora para crear un objeto datetime
        datetime_atencion_str = f"{fecha_atencion} {hora_atencion}"

        # Convertir la cadena datetime a un objeto datetime en la zona horaria correcta
        zona_horaria = pytz.timezone('America/Guayaquil')  # Cambiar aquí
        hora_atencion_datetime = timezone.make_aware(
            datetime.strptime(datetime_atencion_str, '%Y-%m-%d %H:%M'), timezone=zona_horaria
        )

        # Crear el historial clínico con los datos del formulario
        historial = HistorialClinico(
            fk_id_cita=cita,
            fk_id_doctor=doctor,
            fecha_atencion_historial=hora_atencion_datetime,
            hora_atencion_historial=hora_atencion_datetime.time(),
            presion_arterial_historial=request.POST.get('presion_arterial_historial'),
            temperatura_historial=request.POST.get('temperatura_historial'),
            saturacion_oxigeno_historial=request.POST.get('saturacion_oxigeno_historial'),
            frecuencia_respiratoria_historial=request.POST.get('frecuencia_respiratoria_historial'),
            peso_historial=request.POST.get('peso_historial'),
            talla_historial=request.POST.get('talla_historial'),
            nombre_sintoma_historial=request.POST.get('nombre_sintoma_historial'),
            descripcion_sintoma_historial=request.POST.get('descripcion_sintoma_historial'),
            gravedad_sintoma_historial=request.POST.get('gravedad_sintoma_historial'),
            inicio_sintoma_historial=request.POST.get('inicio_sintoma_historial'),
            duracion_sintoma_historial=request.POST.get('duracion_sintoma_historial'),
            frecuecia_sintoma_historial=request.POST.get('frecuecia_sintoma_historial'),
            tipo_sintoma_historial=request.POST.get('tipo_sintoma_historial'),
            nombre_diagnostico_historial=request.POST.get('nombre_diagnostico_historial'),
            descripcion_diagnostico_historial=request.POST.get('descripcion_diagnostico_historial'),
            cie10_diagnostico_historial=request.POST.get('cie10_diagnostico_historial'),
            medicamento_tratamiento_historial=request.POST.get('medicamento_tratamiento_historial'),
            instrucciones_tratamiento_historial=request.POST.get('instrucciones_tratamiento_historial'),
            fecha_inicio_tratamiento_historial=request.POST.get('fecha_inicio_tratamiento_historial'),
            fecha_fin_tratamiento_historial=request.POST.get('fecha_fin_tratamiento_historial'),
            observaciones_tratamiento_historial=request.POST.get('observaciones_tratamiento_historial')
        )

        historial.save()

        # Actualizar el estado de la cita
        cita.estado_cita = 'COMPLETADO'
        cita.save()

        return redirect('gestion_pacientes:citas')

    # Asegurarnos de que la hora de la cita esté en la zona horaria correcta
    if cita.hora_cita:
        # Verificamos si hora_cita es un objeto datetime
        if isinstance(cita.hora_cita, datetime):
            # Ajustamos la hora a la zona horaria de Guayaquil
            zona_horaria = pytz.timezone('America/Guayaquil')
            hora_atencion = timezone.localtime(cita.hora_cita).astimezone(zona_horaria).strftime('%H:%M')
        else:
            # Si no es un datetime, asignamos None
            hora_atencion = None
    else:
        hora_atencion = None

    context = {
        'cita': cita,
        'paciente': cita.fk_id_paciente,
        'doctores': doctores,
        'doctor': doctor,
        'hora_atencion': hora_atencion,  # Pasamos la hora ajustada a la zona horaria
    }

    return render(request, 'gestion_pacientes/registro_cita.html', context)

@login_required
def cancelar_cita(request, id_cita):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        cita = get_object_or_404(Citas, id_cita=id_cita)

        # Solo permitir cancelar citas en estado "PENDIENTE"
        if cita.estado_cita == "COMPLETADO":
            return JsonResponse({'error': 'No se puede cancelar una cita que ya ha sido completada.'}, status=400)

        if cita.estado_cita == "CANCELADO":
            return JsonResponse({'error': 'Esta cita ya ha sido cancelada.'}, status=400)

        if cita.estado_cita != "PENDIENTE":
            return JsonResponse({'error': 'Solo se pueden cancelar citas en estado PENDIENTE.'}, status=400)

        # Cambiar el estado de la cita a CANCELADO
        cita.estado_cita = "CANCELADO"
        cita.save()

        return JsonResponse({'message': 'Cita cancelada correctamente.'}, status=200)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)



@login_required
def historias_clinicas(request):
    historias = HistorialClinico.objects.select_related('fk_id_cita__fk_id_paciente').all()
    return render(request, 'gestion_pacientes/historias_clinicas.html', {'historias': historias})

@login_required
def ver_historial_clinico(request, id_paciente):
    paciente = get_object_or_404(Pacientes, id_pacientes=id_paciente)
    historial_clinico = HistorialClinico.objects.filter(fk_id_cita__fk_id_paciente=paciente).last()
    return render(request, 'gestion_pacientes/ver_historial_clinico.html', {
        'paciente': paciente,
        'historial_clinico': historial_clinico,
    })

