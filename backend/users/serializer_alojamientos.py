from rest_framework import serializers
from .models import *

class TipoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServicio
        fields = '__all__'

class TipoAlojamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAlojamiento
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class AlojamientosSerializer(serializers.ModelSerializer):
    servicios = TipoServicioSerializer(many=True)  
    
    class Meta:
        model = Alojamientos
        fields = '__all__'