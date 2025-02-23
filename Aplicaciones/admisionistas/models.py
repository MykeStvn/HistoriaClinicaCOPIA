from django.db import models

from Aplicaciones.usuarios.models import Usuarios

#Pacientes
class Pacientes(models.Model):
    id_pacientes = models.AutoField(primary_key=True)
    fk_id_admisionista = models.ForeignKey(
        Usuarios,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='fk_id_admisionista',
        limit_choices_to={'tipo_usuario': 'admisionista'},  # Solo admisionistas
        verbose_name="Admisionista"
    )
    apellido_paterno_pacientes = models.CharField(max_length=255)
    apellido_materno_pacientes = models.CharField(max_length=255)
    nombres_pacientes = models.CharField(max_length=255)
    cedula_pacientes = models.CharField(max_length=15, unique=True)
    fecha_nacimiento_pacientes = models.DateField()
    lugar_nacimiento_pacientes = models.TextField(max_length=254,null=True,blank=True)
    nacionalidad_pacientes = models.TextField(max_length=254,null=True,blank=True)
    grupo_cultural_pacientes = models.TextField(max_length=254,null=True,blank=True)
    direccion_pacientes = models.TextField()
    email_pacientes = models.EmailField(max_length=254)
    telefono_pacientes = models.CharField(max_length=15)
    estado_civil_pacientes = models.TextField(max_length=254,null=True,blank=True)
    genero_pacientes = models.CharField(max_length=255)
    instruccion_academica_pacientes = models.TextField(max_length=254,null=True,blank=True)
    ocupacion_pacientes = models.TextField(max_length=254,null=True,blank=True)
    empresa_trabaja_pacientes = models.TextField(max_length=254,null=True,blank=True)
    seguro_pacientes = models.CharField(max_length=255)
    emergencia_informar_pacientes = models.CharField(max_length=255)
    parentesco_pacientes = models.TextField(max_length=254,null=True,blank=True)
    contacto_emergencia_pacientes = models.CharField(max_length=15)
    #DEFAULT ACTIVO CADA VEZ QUE SE CREA UN USUARIO
    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = 'pacientes'

    def __str__(self):
        return f"{self.nombres_pacientes} {self.apellido_paterno_pacientes} {self.apellido_materno_pacientes} {self.is_active}"
    
    def save(self, *args, **kwargs):
        self.apellido_paterno_pacientes = self.apellido_paterno_pacientes.upper()
        self.apellido_materno_pacientes = self.apellido_materno_pacientes.upper()
        self.nombres_pacientes = self.nombres_pacientes.upper()
        self.direccion_pacientes = self.direccion_pacientes.upper()
        self.genero_pacientes = self.genero_pacientes.upper()
        self.emergencia_informar_pacientes = self.emergencia_informar_pacientes.upper()
        self.seguro_pacientes = self.seguro_pacientes.upper()
        self.estado_civil_pacientes = self.estado_civil_pacientes.upper()
        self.lugar_nacimiento_pacientes = self.lugar_nacimiento_pacientes.upper()
        self.nacionalidad_pacientes = self.nacionalidad_pacientes.upper()
        self.grupo_cultural_pacientes = self.grupo_cultural_pacientes.upper()
        self.instruccion_academica_pacientes = self.instruccion_academica_pacientes.upper()
        self.ocupacion_pacientes = self.ocupacion_pacientes.upper()
        self.empresa_trabaja_pacientes = self.empresa_trabaja_pacientes.upper()
        self.parentesco_pacientes = self.parentesco_pacientes.upper()

        super(Pacientes, self).save(*args, **kwargs)


# class Citas(models.Model):
#     ESTADO_OPCIONES = [
#         ('PENDIENTE','PENDIENTE'),
#         ('CONFIRMADA','CONFIRMADA'),
#         ('CANCELADA','CANCELADA'),
#         ('COMPLETADA','COMPLETADA'),
#     ]

#     id_cita = models.AutoField(primary_key=True)
#     fecha_cita = models.DateField()
#     hora_cita = models.TimeField()
#     estado_cita = models.CharField(max_length=20, choices=ESTADO_OPCIONES, default='PENDIENTE')
#     fk_id_paciente = models.ForeignKey(Pacientes, on_delete = models.PROTECT, db_column  = 'fk_id_pacientes', related_name = 'citas')
#     #pongo en PROTECT para prevenir que se elimine por cualquier situación el paciente
#     class Meta: 
#         db_table = 'citas'
#         verbose_name = 'Cita'
#         verbose_name_plural = 'Citas'
#         ordering = ['-fecha_cita', '-hora_cita']

#     def __str__(self):
#         return f"Cita de {self.fk_id_paciente.id_pacientes} - {self.fk_id_paciente.nombres_pacientes} {self.fk_id_paciente.apellido_paterno_pacientes} el {self.fecha_cita} a las {self.hora_cita} ({self.estado_cita})"

class Citas(models.Model):
    ESTADO_OPCIONES = [
        ('PENDIENTE', 'PENDIENTE'),
        ('CONFIRMADA', 'CONFIRMADA'),
        ('CANCELADA', 'CANCELADA'),
        ('COMPLETADA', 'COMPLETADA'),
    ]

    id_cita = models.AutoField(primary_key=True)
    fecha_cita = models.DateField()
    hora_cita = models.TimeField()
    estado_cita = models.CharField(max_length=20, choices=ESTADO_OPCIONES, default='PENDIENTE')
    fk_id_paciente = models.ForeignKey(Pacientes, on_delete=models.PROTECT, db_column='fk_id_pacientes', related_name='citas')
    motivo_cancelacion = models.TextField(blank=True, null=True)  # Campo para el motivo de cancelación

    class Meta:
        db_table = 'citas'
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-fecha_cita', '-hora_cita']

    def __str__(self):
        return f"Cita de {self.fk_id_paciente.id_pacientes} - {self.fk_id_paciente.nombres_pacientes} {self.fk_id_paciente.apellido_paterno_pacientes} el {self.fecha_cita} a las {self.hora_cita} ({self.estado_cita})"

    def save(self, *args, **kwargs):
        if self.motivo_cancelacion:
            self.motivo_cancelacion = self.motivo_cancelacion.upper()  # Convertir a mayúsculas
        super().save(*args, **kwargs)
