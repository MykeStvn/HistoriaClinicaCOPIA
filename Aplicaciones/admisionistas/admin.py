from django.contrib import admin

from Aplicaciones.admisionistas.models import Pacientes, Citas

admin.site.register(Pacientes)
admin.site.register(Citas)