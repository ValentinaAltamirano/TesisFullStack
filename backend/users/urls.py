from django.urls import path
from django import urls
from .views import *

urlpatterns = [
    path('empresario/registrarUsuario/', registrar_usuario, name='registrar_empresario'),
    path('empresario/usuario/<int:id_usuario>/', registrar_usuario_empresario, name='registrarEmpresarioUsuario'),
    path('empresario/<int:pk>/', getEmpresario.as_view(), name='empresario-detail'),
    path('empresario/<int:pk>/update/', updateEmpresario.as_view(), name='empresario-update'),
    path('empresario/<int:pk>/delete/', deleteEmpresario.as_view(), name='empresario-delete'),
    path('empresarios/', listEmpresarios, name='list_empresarios'),
    
    path('usuarios/', listUsuarios, name='ver_usuarios'),
    
    path('rol/create/', setRol.as_view(), name='rol-create'),
    path('rol/<int:pk>/', getRol.as_view(), name='get_rol'),
    path('roles/', listRoles.as_view(), name='list_roles'),
    path('roles/<int:pk>/delete/', deleteRol.as_view(), name='rol-delete'),
]
