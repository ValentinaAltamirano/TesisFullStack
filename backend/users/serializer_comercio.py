from rest_framework import serializers
from .models import *
from .serializer_establecimientos import *
from .serializer_empresario import *

class MetodoDePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoDePago
        fields = ['nombre']
        
class TipoComercioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComercio
        fields = '__all__'

class ComercioSerializer(serializers.ModelSerializer):
    codTipoComercio = TipoComercioSerializer(many=True)
    class Meta:
        model = Comercio
        fields = '__all__'
