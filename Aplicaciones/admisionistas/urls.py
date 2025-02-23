from django.urls import path
from django.views.generic import TemplateView

from Aplicaciones.admisionistas import views

app_name = 'admisionistas'

urlpatterns = [
    #INGRESO PACIENTES
    path('ingreso_pacientes/', views.ingreso_pacientes, name='ingreso_pacientes'),
    path('agregar_paciente/', views.agregar_paciente, name='agregar_paciente'),
    path('obtener_paciente/<int:paciente_id>/', views.obtener_paciente, name='obtener_paciente'),
    path('actualizar_paciente/', views.actualizar_paciente, name='actualizar_paciente'),  # Nueva ruta para actualizar
    path('eliminar_paciente/<int:paciente_id>/', views.eliminar_paciente, name='eliminar_paciente'),
    path('verificar_cedula/', views.verificar_cedula, name='verificar_cedula'),
    path('verificar_cedula_actualizar/', views.verificar_cedula_actualizar, name='verificar_cedula_actualizar'),
    path('buscar_pacientes/', views.buscar_pacientes, name='buscar_pacientes'),
    # ASIGAR CITAS
    path('registro_citas/', views.registro_citas, name='registro_citas'),
    path('registrar_cita/', views.registrar_cita, name='registrar_cita'),
    path('cargar_citas/', views.cargar_citas, name='cargar_citas'),
    path('eliminar_cita/<int:id_cita>/', views.eliminar_cita, name='eliminar_cita'),
    #HISTORIAL CITAS
    path('historial_citas/', views.historial_citas, name='historial_citas'),
    path('cargar_historial_citas/', views.cargar_historial_citas, name='cargar_historial_citas'),
    #VERIFICAR ESTADO DE LAS CITAS
    path('verificar_estado_cita/<int:id_cita>/', views.verificar_estado_cita, name='verificar_estado_cita'),
    #CANCELAR CITA
    path('cancelar_cita/<int:id_cita>/', views.cancelar_cita, name='cancelar_cita'),
    #DASHBOARD    
    path('dashboard_citas/', views.dashboard_citas, name='dashboard_citas'),



]