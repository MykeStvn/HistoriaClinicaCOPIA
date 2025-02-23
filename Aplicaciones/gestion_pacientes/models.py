from django.db import models

#Paciente
#class Pacientes(models.Model):
    #pk_id_pacientes = models.AutoField(primary_key=True)

from Aplicaciones.admisionistas.models import Citas
from Aplicaciones.usuarios.models import Usuarios

#Modelo HISTORIAL CLINICO
class HistorialClinico(models.Model):
    id_historial = models.AutoField(primary_key=True)
    fk_id_cita = models.ForeignKey(Citas, on_delete=models.PROTECT, db_column='fk_id_cita', related_name = 'historiales')
    fk_id_doctor = models.ForeignKey(
        Usuarios,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='fk_id_doctor',
        limit_choices_to={'tipo_usuario': 'doctor'},  # Solo doctor
        related_name='historiales_doctor',
        verbose_name="Doctor"
    )
    fecha_atencion_historial = models.DateField()
    hora_atencion_historial = models.TimeField()
    presion_arterial_historial = models.CharField(max_length = 50) #120/80 validar que sea asi
    temperatura_historial = models.DecimalField(max_digits=5, decimal_places=2) # -27 muerto, 36.5 a 37 normal, ayor a 37 fiebre
    saturacion_oxigeno_historial = models.IntegerField() #que este en los rangos
    frecuencia_respiratoria_historial = models.IntegerField() #que este en el rango
    peso_historial = models.DecimalField(max_digits=5, decimal_places=2) # que este en el rango (sobrepes, peso normal, etc)
    talla_historial = models.DecimalField(max_digits=5, decimal_places=2)
    nombre_sintoma_historial = models.TextField()
    descripcion_sintoma_historial = models.TextField()
    gravedad_sintoma_historial = models.CharField(max_length = 255)
    inicio_sintoma_historial = models.TextField()
    duracion_sintoma_historial = models.TextField()
    frecuecia_sintoma_historial = models.TextField()
    tipo_sintoma_historial = models.TextField()
    nombre_diagnostico_historial = models.TextField()
    descripcion_diagnostico_historial = models.TextField()
    cie10_diagnostico_historial = models.CharField(max_length = 50)
    medicamento_tratamiento_historial = models.TextField()
    instrucciones_tratamiento_historial = models.TextField()
    fecha_inicio_tratamiento_historial = models.DateField()
    fecha_fin_tratamiento_historial = models.DateField()
    observaciones_tratamiento_historial = models.TextField()

    class Meta:
        db_table = 'historial_clinico'

    
    
    def __str__(self):
        return f"PACIENTE: {self.fk_id_cita.fk_id_paciente.apellido_paterno_pacientes} {self.fk_id_cita.fk_id_paciente.nombres_pacientes} - FECHA DE CITA: {self.fk_id_cita.fecha_cita} HORA: {self.fk_id_cita.hora_cita}"
    
    # Sobreescribimos el método save para garantizar que los campos de texto se guarden en mayúsculas
    def save(self, *args, **kwargs):
        # Convertir los campos de texto a mayúsculas
        self.presion_arterial_historial = self.presion_arterial_historial.upper() if self.presion_arterial_historial else self.presion_arterial_historial
        self.gravedad_sintoma_historial = self.gravedad_sintoma_historial.upper() if self.gravedad_sintoma_historial else self.gravedad_sintoma_historial
        self.nombre_sintoma_historial = self.nombre_sintoma_historial.upper() if self.nombre_sintoma_historial else self.nombre_sintoma_historial
        self.descripcion_sintoma_historial = self.descripcion_sintoma_historial.upper() if self.descripcion_sintoma_historial else self.descripcion_sintoma_historial
        self.inicio_sintoma_historial = self.inicio_sintoma_historial.upper() if self.inicio_sintoma_historial else self.inicio_sintoma_historial
        self.duracion_sintoma_historial = self.duracion_sintoma_historial.upper() if self.duracion_sintoma_historial else self.duracion_sintoma_historial
        self.frecuecia_sintoma_historial = self.frecuecia_sintoma_historial.upper() if self.frecuecia_sintoma_historial else self.frecuecia_sintoma_historial
        self.tipo_sintoma_historial = self.tipo_sintoma_historial.upper() if self.tipo_sintoma_historial else self.tipo_sintoma_historial
        self.nombre_diagnostico_historial = self.nombre_diagnostico_historial.upper() if self.nombre_diagnostico_historial else self.nombre_diagnostico_historial
        self.descripcion_diagnostico_historial = self.descripcion_diagnostico_historial.upper() if self.descripcion_diagnostico_historial else self.descripcion_diagnostico_historial
        self.medicamento_tratamiento_historial = self.medicamento_tratamiento_historial.upper() if self.medicamento_tratamiento_historial else self.medicamento_tratamiento_historial
        self.instrucciones_tratamiento_historial = self.instrucciones_tratamiento_historial.upper() if self.instrucciones_tratamiento_historial else self.instrucciones_tratamiento_historial
        self.observaciones_tratamiento_historial = self.observaciones_tratamiento_historial.upper() if self.observaciones_tratamiento_historial else self.observaciones_tratamiento_historial

        # Llamamos al método save de la clase base
        super(HistorialClinico, self).save(*args, **kwargs)