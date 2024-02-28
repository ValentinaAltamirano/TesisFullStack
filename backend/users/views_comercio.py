from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import *
from .serializer_comercio import *
from .serializer_establecimientos import *
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

class MetodoDePagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de metodos de pago
        return Response([item['nombre'] for item in serializer.data])


class TipoComercioViewSet(viewsets.ModelViewSet):
    queryset = TipoComercio.objects.all()
    serializer_class = TipoComercioSerializer
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de metodos de pago
        return Response([item['nombre'] for item in serializer.data])

class ComercioViewSet(viewsets.ModelViewSet):
    queryset = Comercio.objects.all()
    serializer_class = ComercioSerializer
   
    @permission_classes([IsAuthenticated])
    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            print(data)
            # Datos Establecimiento
            
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
            nombresMetodosPago = request.data.get('metodosPagoSeleccionados', [])
            idsMetodosDePago = MetodoDePago.objects.filter(nombre__in=nombresMetodosPago).values_list('codMetodoDePago', flat=True)
            
            # Datos comercio
            nombresTiposComercios = request.data.get('tipoComerciosSeleccionados', [])
            idsTiposComercios= TipoComercio.objects.filter(nombre__in=nombresTiposComercios).values_list('codTipoComercio', flat=True)
            print('idsTiposComercios:', idsTiposComercios)
            # Crear una instancia de comercio y establecer las relaciones con otros modelos
            comercio = Comercio.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono,  web = web)
            comercio.metodos_de_pago.set(idsMetodosDePago)
            comercio.codTipoComercio.set(idsTiposComercios)# linea que agregue para solucionar el error de que solo 
            print(comercio.codTipoComercio.set(idsTiposComercios))                                                # muestra el id, ahora muestra id y nombre de metodo de pago
            idEstablecimiento = comercio.codEstablecimiento
            
            return JsonResponse({'establecimientoId': idEstablecimiento, 'mensaje': 'Local Comercial creado exitosamente'}, status=200)
        
        except Exception as e:
            print('Error en la creación de comercio:', e)
            return Response({'error': 'Error en la creación de gastronomía'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    @permission_classes([IsAuthenticated])
    def obtenerComercioEmpresario(self, request, *args, **kwargs):
        try:
            # Obtén el empresario asociado al usuario autenticado
            empresario = Empresario.objects.get(user=request.user)

            # Obtén los locales gastronomicos asociados al empresario
            comercio = Comercio.objects.filter(empresario=empresario)

            if comercio.exists():
                # Serializa la lista de locales gastronomico
                serializer = ComercioSerializer(comercio, many=True)
                return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'No se encontró ningún local comercial asociado al empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Empresario.DoesNotExist:
            return JsonResponse({'error': 'No se encontró el empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print('Error al obtener el local comercial por ID del empresario:', e)
            return JsonResponse({'error': 'Error al obtener el local gastronomico.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ImagenComercioCreateView(APIView):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, establecimiento_id):
        try:
            imagenes = Imagen.objects.filter(establecimiento_id = establecimiento_id)
            serializer = ImagenSerializer(imagenes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request, *args, **kwargs):
        try:
            establecimientoID = kwargs.get('establecimiento_id', '')  # Obtén el ID del comercio desde la URL
            comercio = Establecimiento.objects.get(codEstablecimiento=establecimientoID)  # Utiliza Establecimiento en lugar de comercio

            imagenes = request.FILES.getlist('imagenes')
            for imagen in imagenes:
                Imagen.objects.create(establecimiento=comercio, imagen=imagen)

            return Response({'mensaje': 'Imágenes cargadas exitosamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print('Error en la carga de imágenes:', e)
            return Response({'error': 'Error en la carga de imágenes'}, status=status.HTTP_400_BAD_REQUEST)