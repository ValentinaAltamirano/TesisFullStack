from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import *
from .serializer_gastronomia import *
from .serializer_alojamientos import *
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse

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
            print(data)
            
            # Datos Horario
            horaApertura = data.get('horaApertura', '')
            horaCierre = data.get('horaCierre', '')
            horario = Horario.objects.create(horaApertura=horaApertura, horaCierre=horaCierre)
            
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
            
            # Datos Gastronomia
            nombresTiposServicios = request.data.get('servicioSeleccionados', [])
            idsTiposServicios = TipoServGastro.objects.filter(nombre__in=nombresTiposServicios).values_list('codTipoServGastro', flat=True)
            
            nombresTiposGastronomia = request.data.get('tiposGastronomiaSeleccionados', [])
            idsTiposGastronomia = TipoGastronomia.objects.filter(nombre__in=nombresTiposGastronomia).values_list('codTipoGastronomia', flat=True)
            
            nombresTiposComida = request.data.get('tipoComidaSeleccionados', [])
            idsTiposComida = TipoComida.objects.filter(nombre__in=nombresTiposComida).values_list('codTipoComida', flat=True)
            
            nombresTiposPrefAliment = request.data.get('preferenciaAlimentariaSeleccionadas', [])
            idsTiposPrefAliment = TipoPrefAliment.objects.filter(nombre__in=nombresTiposPrefAliment).values_list('codTipoPrefAliment', flat=True)
            
            # Crear una instancia de Gastronomia y establecer las relaciones con otros modelos
            gastronomia = Gastronomia.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono, codHorario = horario, web = web)
            gastronomia.metodos_de_pago.set(idsMetodosDePago)
            gastronomia.tipos_servicio_gastronomico.set(idsTiposServicios)
            gastronomia.tipos_gastronomia.set(idsTiposGastronomia)
            gastronomia.tipos_comida.set(idsTiposComida)
            gastronomia.tipos_pref_alimentaria.set(idsTiposPrefAliment)
            
            idEstablecimiento = gastronomia.codEstablecimiento
            
            return JsonResponse({'establecimientoId': idEstablecimiento, 'mensaje': 'Local Gastronómico creado exitosamente'}, status=200)
        
        except Exception as e:
            print('Error en la creación de gastronomía:', e)
            return Response({'error': 'Error en la creación de gastronomía'}, status=status.HTTP_400_BAD_REQUEST)

class ImagenGastronomiaCreateView(APIView):
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
            establecimiento_id = kwargs.get('establecimiento_id', '')  # Obtén el ID del establecimiento desde la URL
            establecimientoGastronomico = Establecimiento.objects.get(codEstablecimiento=establecimiento_id)  # Utiliza Establecimiento en lugar de Alojamientos

            imagenes = request.FILES.getlist('imagenes')
            print(imagenes)
            for imagen in imagenes:
                Imagen.objects.create(establecimiento=establecimientoGastronomico, imagen=imagen)

            return Response({'mensaje': 'Imágenes cargadas exitosamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print('Error en la carga de imágenes:', e)
            return Response({'error': 'Error en la carga de imágenes'}, status=status.HTTP_400_BAD_REQUEST)