from rest_framework import serializers
from .models import Empresario, Rol, Usuario

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ('idRol', 'nombre')

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class EmpresarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresario
        fields = '__all__'