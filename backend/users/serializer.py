from rest_framework import serializers
from .models import Empresario, Rol, Usuario

class EmpresarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresario
        fields = '__all__'