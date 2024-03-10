from .serializer_turista import *
from .models import *
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.contrib.auth.models import Group
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from django.http import FileResponse
from django.core.exceptions import ObjectDoesNotExist

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class TuristaViewSet(viewsets.ModelViewSet):
    queryset = Turista.objects.all()
    serializer_class = TuristaSerializer
    def create(self, request, *args, **kwargs):
            data = request.data
            username = data.get('username', '')
            password = data.get('password', '')
            email = data.get('email', '')
            first_name = data.get('nombre', '')
            last_name = data.get('apellido', '')
            
            # Verificar si el nombre de usuario ya existe
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=400)
            
            # Verificar si el correo electrónico ya está en uso
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)
            
            # Crear el usuario
            user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
            
            # Crear el objeto Turista
            turista = Turista(user=user)
            turista.save()

            # Obtener o crear el grupo Turista
            grupo_turista, created = Group.objects.get_or_create(name='Turista')

            # Asignar usuario al grupo de Turista
            user.groups.add(grupo_turista)  # Use 'user' instance, not 'User' class

            return JsonResponse({'message': 'Turista creado exitosamente'}, status=201)
    
    @action(detail=False, methods=['GET'])
    @permission_classes([IsAuthenticated])
    def obtenerDatos(self, request, *args, **kwargs):
        turista = Turista.objects.get(user=request.user)

        data_user = {
            'nombre': request.user.first_name,
            'apellido': request.user.last_name,
            'email': request.user.email,
            'username': request.user.username,
            'groups': list(request.user.groups.values_list('name', flat=True)),
            'imagenPefil': turista.codImagenPerfil.imagen.url,  # Assuming imagen is a FileField
            'codTurista': turista.codTurista
        }

        # Check if the request wants the image
        if 'image' in request.GET:
            # If so, return the image as a FileResponse
            image_file = turista.codImagenPerfil.imagen.path
            return FileResponse(open(image_file, 'rb'), content_type='image/jpeg')

        # Combina los datos del turista y del usuario en un solo diccionario
        data = {**data_user}
        return Response(data)
    
    @action(detail=False, methods=['PUT'])
    @permission_classes([IsAuthenticated])
    def actualizarDatos(self, request, *args, **kwargs):
        try:
            usuario = request.user
            print(usuario)
            if request.method == 'POST' or request.method == 'PUT':
                data = request.data
                print(data)
                # Actualiza los campos editables del Turista
                turista, created = Turista.objects.get_or_create(user=usuario)
                # Actualizar el campo codImagenPerfil con una instancia de ImagenPerfil
                imagen_id = data.get('imagenId', turista.codImagenPerfil.pk)
                imagen_perfil = ImagenPerfil.objects.get(pk=imagen_id)
                turista.codImagenPerfil = imagen_perfil
                turista.save()

                # Actualiza los campos editables del Usuario
                usuario.first_name = data.get('nombre', usuario.first_name)
                usuario.last_name = data.get('apellido', usuario.last_name)
                usuario_email = data.get('email', usuario.email)
                usuario_username = data.get('username', usuario.username)

                # Verifica si el nuevo nombre de usuario ya está en uso por otro usuario
                if User.objects.exclude(pk=usuario.pk).filter(username=usuario_username).exists():
                    return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=400)

                # Verifica si el nuevo correo electrónico ya está en uso por otro usuario
                if User.objects.exclude(pk=usuario.pk).filter(email=usuario_email).exists():
                    return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)

                usuario.email = usuario_email
                usuario.username = usuario_username
                usuario.save()

                return JsonResponse({'message': 'Datos actualizados exitosamente'})

        except ObjectDoesNotExist:
            return JsonResponse({'error': 'No se encontró un objeto Turista asociado a este usuario.'}, status=404)
        except Exception as e:
            print(f'Error en la vista actualizar_datos_turista: {e}')
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)

        return JsonResponse({'message': 'Método no permitido'}, status=405)
    
class ImagenPerfilViewSet(viewsets.ModelViewSet):
    queryset = ImagenPerfil.objects.all()
    serializer_class = ImagenPerfilSerializer
    
    def get(self, request):
        try:
            imagenes = ImagenPerfil.objects.all()
            serializer = ImagenPerfilSerializer(imagenes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
       
class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    
    
    @permission_classes([IsAuthenticated]) 
    def create(self, request, *args, **kwargs):
            data = request.data
            print(data)
            titulo = data.get('titulo', '')
            comentario = data.get('comentario', '')
            calificacion = data.get('calificacion', '')
            
            id_establecimiento = data.get('establecimiento', '')
            establecimiento = Establecimiento.objects.get(codEstablecimiento=id_establecimiento)
            
            id_turista = data.get('turista', '')
            turista = Turista.objects.get(codTurista=id_turista)
            
            # Crear el usuario
            comentario = Comentario.objects.create(
            titulo=titulo,
            comentario=comentario,
            calificacion=calificacion,
            establecimiento=establecimiento,
            turista=turista)
           
            return JsonResponse({'message': 'Turista creado exitosamente'}, status=201)
    
    @action(detail=False, methods=['GET'])
    def comentariosEstablecimiento(self, request, *args, **kwargs):
        id_establecimiento = request.query_params.get('establecimiento_id', None)
        
        if id_establecimiento is not None:
            comentarios = Comentario.objects.filter(establecimiento__codEstablecimiento=id_establecimiento)
            serializer = self.get_serializer(comentarios, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'Se requiere el parámetro establecimiento_id'}, status=status.HTTP_400_BAD_REQUEST)
    
    @permission_classes([IsAuthenticated]) 
    def update(self, request, *args, **kwargs):
        comentario_id = kwargs.get('pk')
        if comentario_id is not None:
            comentario = self.get_object()
            data = request.data
            print(data)

            # Actualizar los campos del comentario si están presentes en los datos recibidos
            comentario.titulo = data.get('titulo', comentario.titulo)
            comentario.comentario = data.get('comentario', comentario.comentario)
            comentario.calificacion = data.get('calificacion', comentario.calificacion)

            # Guardar los cambios
            comentario.save()

            return Response({'message': 'Comentario actualizado exitosamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Se requiere el parámetro pk para actualizar el comentario'}, status=status.HTTP_400_BAD_REQUEST)
    
    