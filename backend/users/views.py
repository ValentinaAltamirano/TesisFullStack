from django.http import  Http404, JsonResponse
from .models import Empresario, Rol, Usuario
from .serializer import EmpresarioSerializer, RolSerializer, UsuarioSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from django.db import transaction
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
import secrets

@api_view(['POST'])
def registrar_usuario(request):
    if request.method == 'POST':
        usuario_serializer = UsuarioSerializer(data=request.data.get('usuario', {}))
        print(usuario_serializer)
        with transaction.atomic():
            if usuario_serializer.is_valid():
                usuario = usuario_serializer.save()  # Imprime el objeto usuario
                return Response({'mensaje': 'Usuario registrado exitosamente', 'idUsuario': usuario.idUsuario}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Error al registrar usuario'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def registrar_usuario_empresario(request, id_usuario):
    usuario = get_object_or_404(Usuario, idUsuario=id_usuario)

    if usuario:
        # Existe un usuario con el ID proporcionado, ahora puedes continuar con la lógica de registro
        empresario_data = {'usuario': usuario.idUsuario, **request.data.get('empresario', {})}
        empresario_serializer = EmpresarioSerializer(data=empresario_data)
        if empresario_serializer.is_valid():
            empresario_serializer.save()
            return Response({'mensaje': 'Empresario registrado exitosamente'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Error al registrar empresario', 'detalle': empresario_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def inicioSesion(request):
    username = request.data.get('username', None)
    password = request.data.get('password', None)

    try:
        # Buscar al usuario en la base de datos utilizando nombreUsuario como username
        usuario = get_object_or_404(Usuario, nombreUsuario=username)
        # Verificar la contraseña sin hashing (no recomendado)
        if usuario.clave == password:
            # Generar un token simple
            token = secrets.token_urlsafe(32)
            # Autenticación exitosa
             # Datos a incluir en la respuesta
            respuesta_data = {
                'token': token,
                'nombreUsuario': usuario.nombreUsuario,
                'email': usuario.email,
            }

            # Autenticación exitosa
            response = JsonResponse(respuesta_data)

            # Almacena el token en una cookie
            response.set_cookie('token', token)

            return response
        else:
            # Credenciales inválidas
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    except Usuario.DoesNotExist:
        # El usuario no existe
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)
    except Http404:
        # Otra manera de manejar la falta de coincidencias en la consulta
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        # Registra detalles del error en el sistema de registro
        import logging
        logging.error(f'Error en inicioSesion: {str(e)}')
        return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# @csrf_exempt
# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def obtenerDatosEmpresario(request):
#     if request.method == 'POST':
#         # Obtén el nombre de usuario desde los datos enviados por el frontend
#         username = request.POST.get('username', None)

#         try:
#             # El usuario autenticado estará disponible en request.user
#             usuario = request.user
#             # Buscar al usuario en la base de datos utilizando el nombre de usuario
#             usuario =  Usuario.objects.get(nombreUsuario=username)
#             print(usuario)
#             # Buscar al empresario relacionado con el usuario
#             empresario = Empresario.objects.get(usuario=usuario.idUsuario)
#             # Datos a incluir en la respuesta
#             respuesta_data = {
#                 'username': usuario.nombreUsuario,
#                 'nombre': usuario.nombre,
#                 'apellido ': usuario.apellido ,
#                 'email': usuario.email,
#                 'razonSocial': empresario.razonSocial,
#                 'telefono': empresario.telefono,
#             }

#             # Devolver los datos del usuario en formato JSON
#             return JsonResponse(respuesta_data)

#         except Usuario.DoesNotExist:
#             # El usuario no existe
#             return JsonResponse({'error': 'Usuario no encontrado'}, status=401)

#         except Exception as e:
#             # Registra detalles del error en el sistema de registro
#             import logging
#             logging.error(f'Error en obtener_datos_usuario: {str(e)}')
#             return JsonResponse({'error': 'Error interno del servidor'}, status=500)

#     else:
#         # Método de solicitud no permitido
#         return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerDatosEmpresario(request):
    usuario = request.user

    # Datos del usuario que deseas devolver
    datos_usuario = {
        'nombreUsuario': usuario.username,
        'email': usuario.email,
        # Otros campos que desees incluir
    }

    return Response(datos_usuario)
   
class CrearRol(generics.CreateAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    
class getRol(generics.RetrieveAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class listRoles(generics.ListAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class deleteRol(generics.DestroyAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

@api_view(['GET'])
def listEmpresarios(request):
    empresarios = Empresario.objects.all()
    serializer = EmpresarioSerializer(empresarios, many=True) # Agrega esta línea para imprimir los datos serializados
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def listUsuarios(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)