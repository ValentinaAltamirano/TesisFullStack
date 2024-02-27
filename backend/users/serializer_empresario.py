from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password', 'username', 'first_name', 'last_name', 'email', 'groups' ]
        
class EmpresarioSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Fix the typo here
    class Meta:
        model = Empresario
        fields = '__all__'