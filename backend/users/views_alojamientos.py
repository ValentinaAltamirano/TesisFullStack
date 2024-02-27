from rest_framework import viewsets
from .serializer_alojamientos import *
from .serializer_establecimientos import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.decorators import action
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

class TipoEstablecimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoEstablecimiento.objects.all()
    serializer_class = TipoEstablecimientoSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de alojamiento
        return Response([item['nombre'] for item in serializer.data])

class MetodoDePagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de alojamiento
        return Response([item['nombre'] for item in serializer.data])

class TipoServicioViewSet(viewsets.ModelViewSet):
    queryset = TipoServicio.objects.all()
    serializer_class = TipoServicioSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de alojamiento
        return Response([item['nombre'] for item in serializer.data])

class TipoAlojamientoViewSet(viewsets.ModelViewSet):
    queryset = TipoAlojamiento.objects.all()
    serializer_class = TipoAlojamientoSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de alojamiento
        return Response([item['nombre'] for item in serializer.data])

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de alojamiento
        return Response([item['nombre'] for item in serializer.data])    
# Alojamiento
class AlojamientoViewSet(viewsets.ModelViewSet):
    queryset = Alojamientos.objects.all()
    serializer_class = AlojamientosSerializer
    
    def create(self, request, *args, **kwargs):
        
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            # Datos Establecimiento
            
            #Creo la instancia de TipoEstablecimiento
            id_empresario = data.get('idEmpresario', '')
            empresario = Empresario.objects.get(idEmpresario=id_empresario)
            nombre = data.get('nombre', '')
            calle = data.get('calle', '')
            altura = data.get('altura', '')
            
            #Creo la instancia de Ciudad
            ciudad = data.get('codCiudad', '')
            codCiudad = Ciudad.objects.get(codCiudad=ciudad)
            
            #Creo la instancia de TipoEstablecimiento
            tipo_establecimiento_id = int(data.get('tipoEstablecimiento', ''))
            tipoEstablecimiento = TipoEstablecimiento.objects.get(codTipoEstablecimiento=tipo_establecimiento_id)
            
            descripcion = data.get('descripcion', '')
            telefono = data.get('telefono', '')
            
            web = data.get('web', '')
            
            #metodos_de_pago
            nombres_metodos_pago = request.data.get('metodosPagoSeleccionados', [])
            ids_metodos_pago = MetodoDePago.objects.filter(nombre__in=nombres_metodos_pago).values_list('codMetodoDePago', flat=True)
            
            #TipoServicio
            nombres_servicios = request.data.get('servicioSeleccionados', [])
            ids_servicios = TipoServicio.objects.filter(nombre__in=nombres_servicios).values_list('codTipoServicio', flat=True)
            
            #Alojamientos
            nombre_TipoAlojamiento = data.get('tipoAlojamiento', '').strip()
            id_TipoAlojamiento = TipoAlojamiento.objects.filter(nombre__iexact=nombre_TipoAlojamiento).values_list('codTipoAlojamiento', flat=True).first() 
            codTipoAlojamiento = TipoAlojamiento.objects.get(codTipoAlojamiento=id_TipoAlojamiento)
            
            nombre_categoria = data.get('categoria', '').strip()
            id_categoria = Categoria.objects.filter(nombre__iexact=nombre_categoria).values_list('codCategoria', flat=True).first()
            codCategoria =  Categoria.objects.get(codCategoria=id_categoria)
            
            alojamiento = Alojamientos.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono,  web = web, codTipoAlojamiento = codTipoAlojamiento, codCategoria = codCategoria )
            alojamiento.metodos_de_pago.set(ids_metodos_pago)
            alojamiento.servicios.set(ids_servicios)

            id_establecimiento = alojamiento.codEstablecimiento
            
            return JsonResponse({'alojamientoId': id_establecimiento, 'mensaje': 'Alojamiento creado exitosamente'}, status=200)

        except ValidationError as ve:
            return JsonResponse({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print('Error en la creación:', e)
            return JsonResponse({'error': 'Error en la creación'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['GET'])
    @permission_classes([IsAuthenticated])
    def obtenerAlojamientosEmpresario(self, request, *args, **kwargs):
        try:
            # Obtén el empresario asociado al usuario autenticado
            empresario = Empresario.objects.get(user=request.user)

            # Obtén los alojamientos asociados al empresario
            alojamientos = Alojamientos.objects.filter(empresario=empresario)

            if alojamientos.exists():
                # Serializa la lista de alojamientos
                serializer = AlojamientosSerializer(alojamientos, many=True)
                return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'No se encontró ningún alojamiento asociado al empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Empresario.DoesNotExist:
            return JsonResponse({'error': 'No se encontró el empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print('Error al obtener el alojamiento por ID del empresario:', e)
            return JsonResponse({'error': 'Error al obtener el alojamiento.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImagenAlojamientoCreateView(APIView):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, alojamiento_id):
        try:
            imagenes = Imagen.objects.filter(establecimiento_id=alojamiento_id)
            serializer = ImagenSerializer(imagenes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request, *args, **kwargs):
        try:
            alojamiento_id = kwargs.get('alojamiento_id', '')  # Obtén el ID del alojamiento desde la URL
            alojamiento = Establecimiento.objects.get(codEstablecimiento=alojamiento_id)  # Utiliza Establecimiento en lugar de Alojamientos

            imagenes = request.FILES.getlist('imagenes')
            for imagen in imagenes:
                Imagen.objects.create(establecimiento=alojamiento, imagen=imagen)

            return Response({'mensaje': 'Imágenes cargadas exitosamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print('Error en la carga de imágenes:', e)
            return Response({'error': 'Error en la carga de imágenes'}, status=status.HTTP_400_BAD_REQUEST)

class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer

class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer