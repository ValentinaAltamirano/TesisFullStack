from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import *
from .serializer_gastronomia import *

# Vista para manejar los tipos de gastronomía
class TipoGastronomiaViewSet(viewsets.ModelViewSet):
    queryset = TipoGastronomia.objects.all()
    serializer_class = TipoGastronomiaSerializer
    
    # Sobrescribe el método list para devolver solo los nombres de los tipos de gastronomía
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response([item['nombre'] for item in serializer.data])


# Vista para manejar los tipos de servicio gastronómico
class TipoServGastroViewSet(viewsets.ModelViewSet):
    queryset = TipoServGastro.objects.all()
    serializer_class = TipoServGastroSerializer
    
    # Sobrescribe el método list para devolver solo los nombres de los tipos de servicio gastronómico
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response([item['nombre'] for item in serializer.data])


# Vista para manejar los tipos de comida
class TipoComidaViewSet(viewsets.ModelViewSet):
    queryset = TipoComida.objects.all()
    serializer_class = TipoComidaSerializer
    
    # Sobrescribe el método list para devolver solo los nombres de los tipos de comida
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response([item['nombre'] for item in serializer.data])


# Vista para manejar los tipos de preferencia alimentaria
class TipoPrefAlimentViewSet(viewsets.ModelViewSet):
    queryset = TipoPrefAliment.objects.all()
    serializer_class = TipoPrefAlimentSerializer
    
    # Sobrescribe el método list para devolver solo los nombres de los tipos de preferencia alimentaria
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response([item['nombre'] for item in serializer.data])


# Vista para manejar la gastronomía
class GastronomiaViewSet(viewsets.ModelViewSet):
    queryset = Gastronomia.objects.all()
    serializer_class = GastronomiaSerializer
    
    # Sobrescribe el método create para manejar la creación de instancias de Gastronomia y establecer las relaciones con otros modelos
    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            
            # Obtener los datos necesarios de la solicitud
            tipos_servicio_gastronomico = data.get('tipos_servicio_gastronomico', [])
            tipos_gastronomia = data.get('tipos_gastronomia', [])
            tipos_comida = data.get('tipos_comida', [])
            tipos_pref_alimentaria = data.get('tipos_pref_alimentaria', [])
            
            # Crear una instancia de Gastronomia y establecer las relaciones con otros modelos
            gastronomia = Gastronomia.objects.create()
            gastronomia.tipos_servicio_gastronomico.set(tipos_servicio_gastronomico)
            gastronomia.tipos_gastronomia.set(tipos_gastronomia)
            gastronomia.tipos_comida.set(tipos_comida)
            gastronomia.tipos_pref_alimentaria.set(tipos_pref_alimentaria)
            
            return Response({'message': 'Gastronomía creada exitosamente'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print('Error en la creación de gastronomía:', e)
            return Response({'error': 'Error en la creación de gastronomía'}, status=status.HTTP_400_BAD_REQUEST)

