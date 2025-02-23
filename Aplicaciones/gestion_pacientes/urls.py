from django.urls import path
from . import views
app_name = 'gestion_pacientes'

urlpatterns = [
    path('manejo_pacientes/', views.manejo_pacientes, name='manejo_pacientes'),
    path('inicio_doctor/', views.inicio_doctor, name='inicio_doctor'),
    path('citas/', views.citas, name='citas'),
    path('cargar_citas/', views.cargar_citas, name='cargar_citas'),
    path('registro_cita/<int:id_cita>/', views.registro_cita, name='registro_cita'),
    path('cancelar_cita/<int:id_cita>/', views.cancelar_cita, name='cancelar_cita'),
    path('historias_clinicas/', views.historias_clinicas, name='historias_clinicas'),
    path('ver-historial-clinico/<int:id_paciente>/', views.ver_historial_clinico, name='ver_historial_clinico'),
]
