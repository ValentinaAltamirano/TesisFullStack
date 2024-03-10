from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializer_establecimientos import ImagenSerializer
from .models import *
from .serializer_gastronomia import *
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import json

class MetodoDePagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoDePago.objects.all()
    serializer_class = MetodoDePagoSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Devuelve solo los nombres de los tipos de metodos de pago
        return Response([item['nombre'] for item in serializer.data])


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
            gastronomia = Gastronomia.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono,  web = web)
            gastronomia.metodos_de_pago.set(idsMetodosDePago)
            gastronomia.tipos_servicio_gastronomico.set(idsTiposServicios)
            gastronomia.tipos_gastronomia.set(idsTiposGastronomia)
            gastronomia.tipos_comida.set(idsTiposComida)
            gastronomia.tipos_pref_alimentaria.set(idsTiposPrefAliment)
            gastronomia.metodos_de_pago.set(idsMetodosDePago)
            
            idEstablecimiento = gastronomia.codEstablecimiento
            print(idEstablecimiento)
            
            return JsonResponse({'establecimientoId': idEstablecimiento, 'mensaje': 'Local Gastronómico creado exitosamente'}, status=200)
        
        except Exception as e:
            print('Error en la creación de gastronomía:', e)
            return Response({'error': 'Error en la creación de gastronomía'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    @permission_classes([IsAuthenticated])
    def obtenerGastronomiaEmpresario(self, request, *args, **kwargs):
        try:
            # Obtén el empresario asociado al usuario autenticado
            empresario = Empresario.objects.get(user=request.user)

            # Obtén los locales gastronomicos asociados al empresario
            gastronomia = Gastronomia.objects.filter(empresario=empresario)

            if gastronomia.exists():
                # Serializa la lista de locales gastronomico
                serializer = GastronomiaSerializer(gastronomia, many=True)
                return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'No se encontró ningún local gastronomico asociado al empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Empresario.DoesNotExist:
            return JsonResponse({'error': 'No se encontró el empresario.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print('Error al obtener el local gastronomico por ID del empresario:', e)
            return JsonResponse({'error': 'Error al obtener el local gastronomico.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['PUT'])
    @permission_classes([IsAuthenticated])
    def actualizarDatos(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            GastronomiaId = data.get('codEstablecimiento', '')
            
            # Obtén la instancia de Local Gastronomico
            gastronomia = Gastronomia.objects.get(codEstablecimiento=GastronomiaId)

            # Actualiza los campos necesarios
            gastronomia.nombre = data.get('nombre', gastronomia.nombre)
            gastronomia.calle = data.get('calle', gastronomia.calle)
            gastronomia.altura = data.get('altura', gastronomia.altura)
            
            
            gastronomia.descripcion = data.get('descripcion', '')
            gastronomia.telefono = data.get('telefono', '')
            
            gastronomia.web = data.get('web', '')
            
            nombresMetodosPago = request.data.get('metodos_de_pago', [])
            idsMetodosDePago = MetodoDePago.objects.filter(nombre__in=nombresMetodosPago).values_list('codMetodoDePago', flat=True)
            
            # Datos Gastronomia
            nombresTiposServicios = request.data.get('tipos_servicio_gastronomico', [])
            idsTiposServicios = TipoServGastro.objects.filter(nombre__in=nombresTiposServicios).values_list('codTipoServGastro', flat=True)
            
            nombresTiposGastronomia = request.data.get('tipos_gastronomia', [])
            idsTiposGastronomia = TipoGastronomia.objects.filter(nombre__in=nombresTiposGastronomia).values_list('codTipoGastronomia', flat=True)
            
            nombresTiposComida = request.data.get('tipos_comida', [])
            idsTiposComida = TipoComida.objects.filter(nombre__in=nombresTiposComida).values_list('codTipoComida', flat=True)
            
            nombresTiposPrefAliment = request.data.get('tipos_pref_alimentaria', [])
            idsTiposPrefAliment = TipoPrefAliment.objects.filter(nombre__in=nombresTiposPrefAliment).values_list('codTipoPrefAliment', flat=True)
            
            # Guarda los cambios
            gastronomia.save()
            gastronomia.metodos_de_pago.set(idsMetodosDePago)
            gastronomia.tipos_servicio_gastronomico.set(idsTiposServicios)
            gastronomia.tipos_gastronomia.set(idsTiposGastronomia)
            gastronomia.tipos_comida.set(idsTiposComida)
            gastronomia.tipos_pref_alimentaria.set(idsTiposPrefAliment)
            

            return JsonResponse({'mensaje': 'Local gastronomico actualizado exitosamente'}, status=200)

        except Gastronomia.DoesNotExist:
            return JsonResponse({'error': 'No se encontró el local gastronomico.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print('Error en la actualización del local gastronomico:', e)
            return JsonResponse({'error': 'Error en la actualización del local gastronomico'}, status=status.HTTP_400_BAD_REQUEST)
    
    
        
class ImagenGastronomiaCreateView(APIView):
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
            establecimientoID = kwargs.get('establecimiento_id', '')  # Obtén el ID del gastronomia desde la URL
            gastronomia = Establecimiento.objects.get(codEstablecimiento=establecimientoID)  # Utiliza Establecimiento en lugar de Gastronomia

            imagenes = request.FILES.getlist('imagenes')
            for imagen in imagenes:
                Imagen.objects.create(establecimiento=gastronomia, imagen=imagen)

            return Response({'mensaje': 'Imágenes cargadas exitosamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print('Error en la carga de imágenes:', e)
            return Response({'error': 'Error en la carga de imágenes'}, status=status.HTTP_400_BAD_REQUEST)
            
    def put(self, request, establecimiento_id):
        try:
            establecimiento = Establecimiento.objects.get(codEstablecimiento=establecimiento_id)

            # Accede a las imágenes en la clave 'imagenes'
            nuevas_imagenes = request.FILES.getlist('imagenes')
            print(nuevas_imagenes)
            
            # Obtén las imágenes existentes del alojamiento
            imagenes_existentes = Imagen.objects.filter(establecimiento=establecimiento)
            print(imagenes_existentes)
            # Lista para almacenar los objetos File de las nuevas imágenes
            nuevas_imagenes_procesadas = []

            # Recorrer las nuevas imágenes y cargarlas
            for nueva_imagen in nuevas_imagenes:
                nuevas_imagenes_procesadas.append(nueva_imagen)

            # Agregar las nuevas imágenes que no estaban presentes
            for nueva_imagen in nuevas_imagenes_procesadas:
                if not imagenes_existentes.filter(imagen=nueva_imagen).exists():
                    Imagen.objects.create(establecimiento=establecimiento, imagen=nueva_imagen)

            # Eliminar imágenes marcadas para eliminación
           
            imagenes_a_eliminar_ids = request.data.getlist('imagenesEliminadas', [])

            # Asegúrate de que haya algún valor en la lista antes de intentar acceder al primer elemento
            if imagenes_a_eliminar_ids:
                # Extrae el primer elemento del array (ya que parece que solo estás pasando un valor)
                codImagen = imagenes_a_eliminar_ids[0]

                # Ahora puedes utilizar codImagen como un número
                imagenes_a_eliminar = Imagen.objects.filter(codImagen=codImagen)
                imagenes_a_eliminar.delete()

            return Response({'mensaje': 'Imágenes actualizadas exitosamente'}, status=status.HTTP_200_OK)

        except Exception as e:
            print('Error en la actualización de imágenes:', e)
            return Response({'error': 'Error en la actualización de imágenes'}, status=status.HTTP_400_BAD_REQUEST)