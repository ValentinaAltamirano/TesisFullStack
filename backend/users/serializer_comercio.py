from rest_framework import serializers
from .models import TipoComercio, Comercio
from .serializer_establecimientos import *
from .serializer_empresario import *

class TipoComercioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComercio
        fields = '__all__'

class ComercioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comercio
        fields = '__all__'
