
# from django.contrib import admin
# from django.urls import include, path

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('Aplicaciones.informativa.urls')),
#     path('usuarios/', include('Aplicaciones.usuarios.urls')),  # URLs de usuarios}
#     # Agrega las rutas para las otras aplicaciones
#     path('admisionistas/', include('Aplicaciones.admisionistas.urls')),  # Rutas para el proyecto de admisionistas
#     path('gestion_pacientes/', include('Aplicaciones.gestion_pacientes.urls')),  # Rutas para el proyecto de doctores
#     path('accounts/', include('django.contrib.auth.urls'))
# ]

from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static

from historial_clinico import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Aplicaciones.informativa.urls')),
    path('usuarios/', include('Aplicaciones.usuarios.urls')),  # URLs de usuarios
    path('admisionistas/', include('Aplicaciones.admisionistas.urls')),
    path('gestion_pacientes/', include('Aplicaciones.gestion_pacientes.urls')),
    path('administradores/', include('Aplicaciones.administradores.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)