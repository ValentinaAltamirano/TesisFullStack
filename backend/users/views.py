from django.shortcuts import render, redirect
from .models import Empresario
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
import json
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework_simplejwt.tokens import AccessToken

@api_view(['POST'])
def crear_empresario(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', '')
        password = data.get('password', '')
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        razon_social = data.get('razonSocial', '')
        descripcion = data.get('descripcion', '')
        telefono = data.get('telefono', '')

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
    
    
