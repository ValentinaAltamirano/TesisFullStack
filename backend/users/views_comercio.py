from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import TipoComercio, Comercio
from .serializer_comercio import TipoComercioSerializer, ComercioSerializer


class TipoComercioViewSet(viewsets.ModelViewSet):
    queryset = TipoComercio.objects.all()
    serializer_class = TipoComercioSerializer

class ComercioViewSet(viewsets.ModelViewSet):
    queryset = Comercio.objects.all()
    serializer_class = ComercioSerializer