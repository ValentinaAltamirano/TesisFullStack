from rest_framework import viewsets, generics

from .serializer_alojamientos import *
from .serializer_establecimientos import *
from .models import *

class TipoEstablecimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoEstablecimiento.objects.all()
    serializer_class = TipoEstablecimientoSerializer

class EstablecimientoViewSet(viewsets.ModelViewSet):
    queryset = Establecimiento.objects.all()
    serializer_class = EstablecimientoSerializer

class MetodoDePagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer

class RedSocialViewSet(viewsets.ModelViewSet):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer

class TipoServicioViewSet(viewsets.ModelViewSet):
    queryset = TipoServicio.objects.all()
    serializer_class = TipoServicioSerializer

class TipoAlojamientoViewSet(viewsets.ModelViewSet):
    queryset = TipoAlojamiento.objects.all()
    serializer_class = TipoAlojamientoSerializer

# Alojamiento
class AlojamientoViewSet(viewsets.ModelViewSet):
    queryset = Alojamiento.objects.all()
    serializer_class = AlojamientoSerializer

#Localizacion

class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer

class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer