from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('empresario/registrarUsuario/', registrar_usuario, name='registrar_usuario'),
    path('empresario/usuario/<int:id_usuario>/', registrar_usuario_empresario, name='registrarEmpresarioUsuario'),
    path('empresario/<int:pk>/', getEmpresario.as_view(), name='empresario-detail'),
    path('empresario/<int:pk>/update/', updateEmpresario.as_view(), name='empresario-update'),
    path('empresario/<int:pk>/delete/', deleteEmpresario.as_view(), name='empresario-delete'),
    path('empresarios/', listEmpresarios, name='list_empresarios'),
    path('inicioSesion/', inicioSesion, name='inicioSesion'),
    
    path('usuarios/', listUsuarios, name='ver_usuarios'),
    
    path('roles/crear/', CrearRol.as_view(), name='crear_rol'),
    path('rol/<int:pk>/', getRol.as_view(), name='get_rol'),
    path('roles/<int:pk>/delete/', deleteRol.as_view(), name='rol-delete'),
]
