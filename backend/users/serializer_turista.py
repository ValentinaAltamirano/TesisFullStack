from rest_framework import serializers
from .models import *

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'username', 'first_name', 'last_name', 'email', 'groups' ]
        
class ImagenPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPerfil
        fields = '__all__'
        
class TuristaSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    codImagenPerfil = ImagenPerfilSerializer()
    class Meta:
        model = Turista
        fields = '__all__'
        

