from django.db import models
from django.contrib.auth.models import User


class Pais(models.Model):
    codPais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255, blank= False)
    def _str_(self):
        return self.nombre


class Provincia(models.Model):
    codProvincia = models.AutoField(primary_key=True)
    codPais = models.ForeignKey(Pais, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)
    def _str_(self):
        return self.nombre

class Ciudad (models.Model):
    codCiudad = models.AutoField(primary_key=True)
    codProvincia = models.ForeignKey(Provincia, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)
    def _str_(self):
        return self.nombre

class Empresario(models.Model):
    idEmpresario = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    razonSocial = models.CharField(max_length=255)
    descripcion = models.TextField()
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.razonSocial
    
# Modelos de establecimientos

class Telefono(models.Model):
    codTelefono = models.AutoField(primary_key=True)
    horaApertura = models.TimeField()
    horaCierre = models.TimeField()


class TipoEstablecimiento(models.Model):
    codTipoEstablecimiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre

    
class Horario(models.Model):
    codHorario = models.AutoField(primary_key=True)
    horaApertura = models.TimeField()
    horaCierre = models.TimeField()
    
class Establecimiento(models.Model):
    codEstablecimiento = models.AutoField(primary_key=True)
    codCiudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    calle = models.CharField(max_length=255)
    altura = models.IntegerField()
    tipoEstablecimiento = models.ForeignKey(TipoEstablecimiento, on_delete=models.CASCADE)
    empresario = models.ForeignKey(Empresario, on_delete=models.CASCADE)
    codTelefono = models.ForeignKey(Telefono, on_delete=models.CASCADE)
    codHorario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    def _str_(self):
        return self.nombre


class Imagen(models.Model):
    codImagen = models.AutoField(primary_key=True)
    url = models.URLField()
    def _str_(self):
        return self.url

class ImagenXEstablecimiento(models.Model):
    codEstablecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    codImagen = models.ForeignKey(Imagen, on_delete=models.CASCADE)

class MetodoDePago(models.Model):
    codMetodoDePago = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre

class EstablecimientoXMetodoPago(models.Model):
    codEstablecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    codMetodoDePago = models.ForeignKey(MetodoDePago, on_delete=models.CASCADE)

class RedSocial(models.Model):
    codRedSocial = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre

class EstablecimientoXRedSocial(models.Model):
    codEstablecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    codRedSocial = models.ForeignKey(RedSocial, on_delete=models.CASCADE)
    
# Modelos de alojamientos

class TipoServicio(models.Model):
    codTipoServicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre

class TipoAlojamiento(models.Model):
    codTipoAlojamiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre
    
class Categoria(models.Model):
    codCategoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def _str_(self):
        return self.nombre

class Alojamientos(Establecimiento):
    codAlojamiento = models.AutoField(primary_key=True)
    codTipoAlojamiento = models.ForeignKey(TipoAlojamiento, on_delete=models.CASCADE)
    codTipoServicio = models.ForeignKey(TipoServicio, on_delete=models.CASCADE)
    codCategoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

class AlojamientoXTipoServicio(models.Model):
    codAlojamiento = models.ForeignKey(Alojamientos, on_delete=models.CASCADE)
    codTipoServicio = models.ForeignKey(TipoServicio, on_delete=models.CASCADE)