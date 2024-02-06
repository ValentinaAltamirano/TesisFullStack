from django.shortcuts import render
from .serializer_users import EmpresarioSerializer
from .models import *
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
import json
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics

@api_view(['POST'])
def crear_empresario(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
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

        return JsonResponse({'message': 'Empresario creado exitosamente'}, status=201)

    return render(request, 'registro_empresario.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_datos_empresario(request):
    empresario = Empresario.objects.get(user=request.user)
    data_empresario = {
        'razonSocial': empresario.razonSocial,
        'descripcion': empresario.descripcion,
        'telefono': empresario.telefono
    }
    user = request.user  # No necesitas obtener el objeto User de nuevo, ya lo tienes en request.user
    data_user = {
        'nombre': user.first_name,
        'apellido': user.last_name,
        'email': user.email,
        'username': user.username
    }
    # Combina los datos del empresario y del usuario en un solo diccionario
    data = {**data_empresario, **data_user}
    return Response(data)
    
    
@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def actualizar_datos_empresario(request):
    if request.method == 'POST' or request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        
        # Obtén el empresario actual
        empresario = Empresario.objects.get(user=request.user)

        # Actualiza los campos editables
        empresario.razonSocial = data.get('razonSocial', empresario.razonSocial)
        empresario.descripcion = data.get('descripcion', empresario.descripcion)
        empresario.telefono = data.get('telefono', empresario.telefono)

        # Guarda los cambios en el empresario
        empresario.save()
        
        # Obtén el usuario actual
        usuario = User.objects.get(username=request.user)
        
        # Verifica si el nuevo nombre de usuario ya está en uso por otro usuario
        nuevo_username = data.get('username', usuario.username)
        if User.objects.exclude(pk=usuario.pk).filter(username=nuevo_username).exists():
            return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=400)

        # Verifica si el nuevo correo electrónico ya está en uso por otro usuario
        nuevo_email = data.get('email', usuario.email)
        if User.objects.exclude(pk=usuario.pk).filter(email=nuevo_email).exists():
            return JsonResponse({'error': 'El correo electrónico ya está en uso'}, status=400)
        
        # Actualiza los campos editables del usuario
        
        usuario.first_name = data.get('nombre', usuario.first_name)
        usuario.last_name = data.get('apellido', usuario.last_name)
        usuario.email = data.get('email', usuario.email)
        
        # Guarda los cambios en el usuario
        usuario.save()

        return JsonResponse({'message': 'Datos actualizados exitosamente'})
    
    return JsonResponse({'message': 'Método no permitido'}, status=405)


#Get empresario

class empresario_Lista(generics.ListCreateAPIView):
    queryset = Empresario.objects.all()
    serializer_class = EmpresarioSerializer