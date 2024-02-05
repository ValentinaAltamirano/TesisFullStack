from rest_framework import generics

from .serializer_alojamientos import *
from .serializer_establecimientos import *
from .models import *

#TipoEstablecimiento
class TipoEstablecimientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoEstablecimiento.objects.all()
    serializer_class = TipoEstablecimientoSerializer

class TipoEstablecimientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TipoEstablecimiento.objects.all()
    serializer_class = TipoEstablecimientoSerializer

#Establecimiento
class EstablecimientoListCreateView(generics.ListCreateAPIView):
    queryset = Establecimiento.objects.all()
    serializer_class = EstablecimientoSerializer

class EstablecimientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Establecimiento.objects.all()
    serializer_class = EstablecimientoSerializer

#MetodoDePago
class MetodoDePagoListCreateView(generics.ListCreateAPIView):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer

class MetodoDePagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer
    
#RedSocial
class RedSocialListCreateView(generics.ListCreateAPIView):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer

class RedSocialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer

#TipoServicio
class TipoServicioListCreateView(generics.ListCreateAPIView):
    queryset = TipoServicio.objects.all()
    serializer_class = TipoServicioSerializer

class TipoServicioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TipoServicio.objects.all()
    serializer_class = TipoServicioSerializer

#TipoAlojamiento
class TipoAlojamientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoAlojamiento.objects.all()
    serializer_class = TipoAlojamientoSerializer

class TipoAlojamientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TipoAlojamiento.objects.all()
    serializer_class = TipoAlojamientoSerializer