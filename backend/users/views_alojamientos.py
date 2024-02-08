from rest_framework import viewsets, generics
from .serializer_alojamientos import *
from .serializer_establecimientos import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework import status
from django.http import JsonResponse
import json
from PIL import Image

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
            
            # Datos Horario
            horaApertura = data.get('horaApertura', '')
            horaCierre = data.get('horaCierre', '')
            horario = Horario.objects.create(horaApertura=horaApertura, horaCierre=horaCierre)
            
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
            
            alojamiento = Alojamientos.objects.create(empresario=empresario, nombre=nombre, calle=calle, altura = altura, codCiudad = codCiudad, tipoEstablecimiento = tipoEstablecimiento, descripcion = descripcion, telefono = telefono, codHorario = horario, web = web, codTipoAlojamiento = codTipoAlojamiento, codCategoria = codCategoria )
            alojamiento.metodos_de_pago.set(ids_metodos_pago)
            alojamiento.servicios.set(ids_servicios)
            
            #Cargar imágenes
            imagenes = request.FILES.getlist('imagenes')
            
            for imagen in imagenes:
                ruta_guardado = f'media/imagenes_establecimiento/{imagen.name}'
                with open(ruta_guardado, 'wb+') as destino:
                    for chunk in imagen.chunks():
                        destino.write(chunk)

                # Redimensionar la imagen si es necesario
                # Aquí, Pillow (PIL) se utiliza para redimensionar la imagen a 800x600
                try:
                    img = Image.open(ruta_guardado)
                    img.thumbnail((800, 600))
                    img.save(ruta_guardado)
                except Exception as e:
                    print(f"Error al redimensionar la imagen: {e}")

            print('Alojamiento creado exitosamente')
            
            
            return JsonResponse({'mensaje': 'Establecimiento creado exitosamente'}, status=200)
        except ValueError as e:
    # Identificar el campo específico que causó el problema
            for field, value in data.items():
                try:
                    int(value)
                except ValueError:
                    print(f"El valor para '{field}' no es un entero válido: {value}")

            print('Error en la creación:', e)
            return Response({'error': f'Error en la creación: {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print('Error en la creación:', e)
            return Response({'error': 'Error en la creación'}, status=status.HTTP_400_BAD_REQUEST)

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