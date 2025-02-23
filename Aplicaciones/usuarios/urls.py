from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('welcome/', views.welcome_view, name='welcome'),  # Nueva URL para la vista de bienvenida
    path('logout/', views.logout_view, name='logout'),  # Asegúrate de tener esta línea
]
