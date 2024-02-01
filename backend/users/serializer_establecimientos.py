from rest_framework import serializers
from .models import *
from .serializer_users import EmpresarioSerializer

class TipoEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstablecimiento
        fields = '__all__'


class EstablecimientoSerializer(serializers.ModelSerializer):
    tipoEstablecimiento = TipoEstablecimientoSerializer()
    empresario = EmpresarioSerializer()

    class Meta:
        model = Establecimiento
        fields = '__all__'

class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = '__all__'

class MetodoDePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoDePago
        fields = '__all__'

class EstablecimientoXMetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablecimientoXMetodoPago
        fields = '__all__'

class ImagenXEstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenXEstablecimiento
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class RedSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedSocial
        fields = '__all__'

class EstablecimientoXRedSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstablecimientoXRedSocial
        fields = '__all__'