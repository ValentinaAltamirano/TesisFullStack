from rest_framework import serializers
from .models import *

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = '__all__'

class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields = '__all__'

class TipoEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstablecimiento
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class MetodoDePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoDePago
        fields = '__all__'
        
class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = ['imagen']

class EstablecimientoSerializer(serializers.ModelSerializer):
    metodos_de_pago = MetodoDePagoSerializer(many=True)
    imagenes = ImagenSerializer(many=True, read_only=True)
    
    class Meta:
        model = Establecimiento
        fields = '__all__'
        
