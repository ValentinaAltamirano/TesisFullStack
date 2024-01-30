from django.http import  Http404, JsonResponse
from .models import Empresario, Rol, Usuario
from .serializer import EmpresarioSerializer, RolSerializer, UsuarioSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from django.db import transaction
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
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
        print(usuario)
        print(usuario.clave == password)
        # Verificar la contraseña sin hashing (no recomendado)
        if usuario.clave == password:
            # Generar un token simple
            token = secrets.token_urlsafe(32)
            # Autenticación exitosa
            response = JsonResponse({'token': token})
            response.set_cookie('token', token)  # Almacena el token en una cookie
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

class getEmpresario(generics.RetrieveAPIView):
    queryset = Empresario.objects.all()
    serializer_class = EmpresarioSerializer

class updateEmpresario(generics.UpdateAPIView):
    queryset = Empresario.objects.all()
    serializer_class = EmpresarioSerializer

class deleteEmpresario(generics.DestroyAPIView):
    queryset = Empresario.objects.all()
    serializer_class = EmpresarioSerializer
    
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