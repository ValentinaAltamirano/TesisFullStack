from django.db import models
from django.contrib.auth.models import User


class Empresario(models.Model):
    idEmpresario = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    razonSocial = models.CharField(max_length=255)
    descripcion = models.TextField()
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.razonSocial
    
# Modelos de establecimientos

class Pais(models.Model):
    codPais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255, blank= False)
    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    codProvincia = models.AutoField(primary_key=True)
    codPais = models.ForeignKey(Pais, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)

    def __str__(self):
        return self.nombre

class Ciudad(models.Model):
    codCiudad = models.AutoField(primary_key=True)
    codProvincia = models.ForeignKey(Provincia, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)
    def __str__(self):
        return self.nombre

class Telefono(models.Model):
    codTelefono = models.AutoField(primary_key=True)
    horaApertura = models.TimeField()
    horaCierre = models.TimeField()


class TipoEstablecimiento(models.Model):
    codTipoEstablecimiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre
    
class Horario(models.Model):
    codHorario = models.AutoField(primary_key=True)
    horaApertura = models.TimeField()
    horaCierre = models.TimeField()

class MetodoDePago(models.Model):
    codMetodoDePago = models.CharField(max_length=20, primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
    
class Establecimiento(models.Model):
    codEstablecimiento = models.AutoField(primary_key=True)
    empresario = models.ForeignKey(Empresario, on_delete=models.CASCADE, related_name='establecimientos')
    codCiudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    calle = models.CharField(max_length=255)
    altura = models.CharField(max_length=255, default='0')
    descripcion = models.TextField(max_length=255, default='Sin descripcion')
    tipoEstablecimiento = models.ForeignKey(TipoEstablecimiento, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=255)
    codHorario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    web = models.TextField(max_length=255, default='')
    
    metodos_de_pago = models.ManyToManyField(MetodoDePago, related_name='establecimientos')
    
    def __str__(self):
        return f"{self.nombre} - {self.empresario}"
    
class Imagenes(models.Model):
    establecimiento = models.ForeignKey(Establecimiento,on_delete=models.CASCADE,related_name='imagenes')
    codImagen = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='imagenes_establecimiento/')

    def __str__(self):
        return f"Imagen {self.codImagen} de {self.establecimiento.nombre}"
    
# Modelos de alojamientos

class TipoServicio(models.Model):
    codTipoServicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class TipoAlojamiento(models.Model):
    codTipoAlojamiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre
    
class Categoria(models.Model):
    codCategoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class Alojamientos(Establecimiento):
    codTipoAlojamiento = models.ForeignKey(TipoAlojamiento, on_delete=models.CASCADE)
    servicios = models.ManyToManyField(TipoServicio, related_name='alojamientos')
    codCategoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.codTipoAlojamiento.nombre})"
    