from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import *

urlpatterns = [
    path('crear_empresario/', crear_empresario, name='crear_empresario'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('obtener_datos_empresario/', obtener_datos_empresario, name='obtener_datos_empresario'),
    path('actualizar-datos-empresario/', actualizar_datos_empresario, name='actualizar_datos_empresario'),
]
