from rest_framework import serializers
from .models import *


#ultimo cambio para solucionar el error del metododepago en el view
class MetodoDePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoDePago
        fields = ['nombre']


class TipoGastronomiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoGastronomia
        fields = '__all__'

class TipoServGastroSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServGastro
        fields = '__all__'

class TipoComidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComida
        fields = '__all__'

class TipoPrefAlimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPrefAliment
        fields = '__all__'

class GastronomiaSerializer(serializers.ModelSerializer):
    tipos_servicio_gastronomico = TipoServGastroSerializer(many=True)
    tipos_gastronomia = TipoGastronomiaSerializer(many=True)
    tipos_comida = TipoComidaSerializer(many=True)
    tipos_pref_alimentaria = TipoPrefAlimentSerializer(many=True)
    metodos_de_pago = MetodoDePagoSerializer(many=True, read_only=True)

    class Meta:
        model = Gastronomia
        fields = '__all__'