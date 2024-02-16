from rest_framework import serializers
from .models import *
from .serializer_establecimientos import *
from .serializer_users import *

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
    codCiudad = CiudadSerializer()
    codHorario = HorarioSerializer()
    codTipoAlojamiento = TipoAlojamientoSerializer()
    codCategoria = CategoriaSerializer()
    empresario = EmpresarioSerializer()
    metodos_de_pago = MetodoDePagoSerializer(many=True)
    
    class Meta:
        model = Alojamientos
        fields = '__all__'