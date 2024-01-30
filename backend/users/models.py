from django.db import models

class Rol(models.Model):
    idRol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    idUsuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    nombreUsuario = models.CharField(max_length=255, default='username', unique=True)
    email = models.EmailField(unique=True)
    clave = models.CharField(max_length=255)
    codRol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Empresario(models.Model):
    idEmpresario = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='empresario')
    razonSocial = models.CharField(max_length=255)
    descripcion = models.TextField()
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.RazonSocial