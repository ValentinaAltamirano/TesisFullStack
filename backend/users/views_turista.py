from rest_framework import viewsets
from .models import Comentario, Turista
from .serializer_turista import ComentarioSerializer, TuristaSerializer

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class TuristaViewSet(viewsets.ModelViewSet):
    queryset = Turista.objects.all()
    serializer_class = TuristaSerializer