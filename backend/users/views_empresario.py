from .serializer_empresario import *
from .models import *
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.contrib.auth.models import Group
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import Group
from django.contrib.auth import update_session_auth_hash

class EmpresarioViewSet(viewsets.ModelViewSet):
    queryset = Empresario.objects.all()
    serializer_class = EmpresarioSerializer
    
    def create(self, request, *args, **kwargs):
            data = request.data
            username = data.get('username', '')
            password = data.get('password', '')
            email = data.get('email', '')
            first_name = data.get('nombre', '')
            last_name = data.get('apellido', '')
            razon_social = data.get('razonSocial', '')
            descripcion = data.get('descripcion', '')
            telefono = data.get('telefono', '')
            
            # Verificar si el nombre de usuario ya existe
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=400)
            
            # Verificar si el correo electrónico ya está en uso
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)
            
            # Crear el usuario
            user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
            
            
            # Crear el objeto Empresario
            empresario = Empresario(user=user, razonSocial=razon_social, descripcion=descripcion, telefono=telefono)
            empresario.save()

            # Obtener o crear el grupo Empresario
            grupo_empresario, created = Group.objects.get_or_create(name='Empresario')

            # Asignar usuario al grupo de empresarios
            user.groups.add(grupo_empresario)  # Use 'user' instance, not 'User' class

            return JsonResponse({'message': 'Empresario creado exitosamente'}, status=201)
    
    @action(detail=False, methods=['GET'])
    @permission_classes([IsAuthenticated])
    def obtenerDatos(self, request, *args, **kwargs):
        empresario = Empresario.objects.get(user=request.user)
        data_empresario = {
            'id': empresario.idEmpresario,
            'razonSocial': empresario.razonSocial,
            'descripcion': empresario.descripcion,
            'telefono': empresario.telefono,
        }
        user = request.user  # No necesitas obtener el objeto User de nuevo, ya lo tienes en request.user
        group_names = list(user.groups.values_list('name', flat=True))
        data_user = {
            'nombre': user.first_name,
            'apellido': user.last_name,
            'email': user.email,
            'username': user.username,
            'groups': group_names,
        }
        # Combina los datos del empresario y del usuario en un solo diccionario
        data = {**data_empresario, **data_user}
        return Response(data)
    
    @action(detail=False, methods=['PUT'])
    @permission_classes([IsAuthenticated])
    def actualizarDatos(self, request, *args, **kwargs):
        try:
            usuario = request.user
            print(usuario)
            if request.method == 'POST' or request.method == 'PUT':
                data = request.data
                
                # Actualiza los campos editables del Empresario
                empresario, created = Empresario.objects.get_or_create(user=usuario)
                empresario.razonSocial = data.get('razonSocial', empresario.razonSocial)
                empresario.descripcion = data.get('descripcion', empresario.descripcion)
                empresario.telefono = data.get('telefono', empresario.telefono)
                empresario.save()

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
            return JsonResponse({'error': 'No se encontró un objeto Empresario asociado a este usuario.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'Método no permitido'}, status=405)
    
    @action(detail=False, methods=['PUT'])
    @permission_classes([IsAuthenticated])
    def cambiarContrasena(self, request, *args, **kwargs):
        try:
            usuario = request.user
            data = request.data

            contrasena_actual = data.get('contrasenaActual', '')
            nueva_contrasena = data.get('nuevaContrasena', '')
            confirmar_contrasena = data.get('confirmarContrasena', '')

            # Verifica que la contraseña actual sea válida
            if not usuario.check_password(contrasena_actual):
                return JsonResponse({'error': 'La contraseña actual es incorrecta'}, status=400)

            # Verifica que la nueva contraseña y la confirmación coincidan
            if nueva_contrasena != confirmar_contrasena:
                return JsonResponse({'error': 'La nueva contraseña y la confirmación no coinciden'}, status=400)

            # Actualiza la contraseña del usuario
            usuario.set_password(nueva_contrasena)
            usuario.save()

            # Actualiza la sesión del usuario para evitar cierre de sesión
            update_session_auth_hash(request, usuario)

            return JsonResponse({'message': 'Contraseña actualizada exitosamente'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

