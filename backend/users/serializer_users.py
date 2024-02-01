from rest_framework import serializers
from .models import Empresario

class EmpresarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresario
        fields = '__all__'