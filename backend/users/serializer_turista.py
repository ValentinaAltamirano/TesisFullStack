from rest_framework import serializers
from .models import Comentario, Turista

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'

class TuristaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turista
        fields = '__all__'
