from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class Usuarios(AbstractUser):
    TIPO_USUARIO_CHOICES = (
        ('admisionista', 'Admisionista'),
        ('doctor', 'Doctor'),
        ('administrador', 'Administrador'),
    )
    especialidad_choices = (
        ('medico_general', 'Médico General'), #si se inserta con guión bajo es por esto e igual 
        ('admisionista', 'Admisionista'), #en minúscula, puedo cambiar pero estoy probando
        ('administrador', 'Administrador'), #en minúscula, puedo cambiar pero estoy probando
    )
    
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        default='admisionista',
    )
    
    especialidad = models.CharField(
        max_length=50,
        choices=especialidad_choices,  # Solo puede ser Médico General o Admisionista
        blank=True,
        null=True,
        verbose_name="Especialidad",
    )
    #DEFAULT ACTIVO CADA VEZ QUE SE CREA UN USUARIO
    is_active = models.BooleanField(
        default=True,
    )

    # ADICION DE Campo para la imagen de perfil
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.username
    
    def __str__(self):
        return f"USUARIO: {self.username} TIPO DE USUARIO: {self.tipo_usuario}"

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.upper()
        self.last_name = self.last_name.upper()        
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
