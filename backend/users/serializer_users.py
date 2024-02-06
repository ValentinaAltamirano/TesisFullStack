from rest_framework import serializers
from .models import *

#Serializer User

class EmpresarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresario
        fields = '__all__'