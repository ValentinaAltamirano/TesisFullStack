from rest_framework import serializers
from .models import Alojamiento, AlojamientoXTipoServicio, TipoAlojamiento,  TipoServicio,  TipoServicio

class TipoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServicio
        fields = '__all__'

class TipoAlojamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAlojamiento
        fields = '__all__'

class AlojamientoSerializer(serializers.ModelSerializer):
    codTipoAlojamiento = TipoAlojamientoSerializer()
    codTipoServicio = TipoServicioSerializer()

    class Meta:
        model = Alojamiento
        fields = '__all__'

class AlojamientoXTipoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlojamientoXTipoServicio
        fields = '__all__'