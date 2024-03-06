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
import json

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
            
            # Crear una instancia de comercio y establecer las relaciones con otros modelos
            comercio = Comercio.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono,  web = web)
            comercio.metodos_de_pago.set(idsMetodosDePago)
            comercio.codTipoComercio.set(idsTiposComercios)
            # muestra el id, ahora muestra id y nombre de metodo de pago
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
    
    @action(detail=False, methods=['PUT'])
    @permission_classes([IsAuthenticated])
    def actualizarDatos(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            
            comercio_id = data.get('codEstablecimiento', '')
            
            # Obtén la instancia de Alojamientos
            comercio = Comercio.objects.get(codEstablecimiento=comercio_id)

            # Actualiza los campos necesarios
            comercio.nombre = data.get('nombre', comercio.nombre)
            comercio.calle = data.get('calle', comercio.calle)
            comercio.altura = data.get('altura', comercio.altura)
            
            comercio.descripcion = data.get('descripcion', '')
            comercio.telefono = data.get('telefono', '')
            
            comercio.web = data.get('web', '')
            
            nombres_metodos_pago = request.data.get('metodos_de_pago', [])
            ids_metodos_pago = MetodoDePago.objects.filter(nombre__in=nombres_metodos_pago).values_list('codMetodoDePago', flat=True)
            
            # Datos comercio
            nombresTiposComercios = request.data.get('codTipoComercio', [])
            idsTiposComercios= TipoComercio.objects.filter(nombre__in=nombresTiposComercios).values_list('codTipoComercio', flat=True)
            
            # Guarda los cambios
            comercio.save()
            comercio.metodos_de_pago.set(ids_metodos_pago)
            comercio.codTipoComercio.set(idsTiposComercios)

            return JsonResponse({'mensaje': 'Alojamiento actualizado exitosamente'}, status=200)

        except Alojamientos.DoesNotExist:
            return JsonResponse({'error': 'No se encontró el alojamiento.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print('Error en la actualización del alojamiento:', e)
            return JsonResponse({'error': 'Error en la actualización del alojamiento'}, status=status.HTTP_400_BAD_REQUEST)
        
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
    
    def put(self, request, establecimiento_id):
        try:
            comercio = Establecimiento.objects.get(codEstablecimiento=establecimiento_id)

            # Accede a las imágenes en la clave 'imagenes'
            nuevas_imagenes = request.FILES.getlist('imagenes')
            
            # Obtén las imágenes existentes del alojamiento
            imagenes_existentes = Imagen.objects.filter(establecimiento=comercio)

            # Lista para almacenar los objetos File de las nuevas imágenes
            nuevas_imagenes_procesadas = []

            # Recorrer las nuevas imágenes y cargarlas
            for nueva_imagen in nuevas_imagenes:
                nuevas_imagenes_procesadas.append(nueva_imagen)

            # Agregar las nuevas imágenes que no estaban presentes
            for nueva_imagen in nuevas_imagenes_procesadas:
                if not imagenes_existentes.filter(imagen=nueva_imagen).exists():
                    Imagen.objects.create(establecimiento=comercio, imagen=nueva_imagen)

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