from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views_alojamientos import *
from .views_users import *

urlpatterns = [
    path('crear_empresario/', crear_empresario, name='crear_empresario'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('obtener_datos_empresario/', obtener_datos_empresario, name='obtener_datos_empresario'),
    path('actualizar-datos-empresario/', actualizar_datos_empresario, name='actualizar_datos_empresario'),
    path('empresarios/', empresario_Lista.as_view(), name='empresario-lista'),
    
    path('tipoestablecimiento/', TipoEstablecimientoListCreateView.as_view(), name='tipoestablecimiento-list-create'),
    path('tipoestablecimiento/<int:pk>/', TipoEstablecimientoDetailView.as_view(), name='tipoestablecimiento-detail'),

    path('metododepago/', MetodoDePagoListCreateView.as_view(), name='MetodoDePago-list-create'),
    path('metododepago/<int:pk>/', MetodoDePagoDetailView.as_view(), name='MetodoDePago-detail'),
    
    path('redsocial/', RedSocialListCreateView.as_view(), name='RedSocial-list-create'),
    path('redsocial/<int:pk>/', RedSocialDetailView.as_view(), name='RedSocial-detail'),
    
    path('tiposervicio/',TipoServicioListCreateView.as_view(), name='tipo-servicio-list-create'),
    path('redsocial/<int:pk>/', TipoServicioDetailView.as_view(), name='tipo-servicio-detail'),
    
    path('tipoalojamiento/',TipoAlojamientoListCreateView.as_view(), name='tipo-alojamiento-list-create'),
    path('tipoalojamiento/<int:pk>/', TipoAlojamientoDetailView.as_view(), name='tipo-alojamiento-detail'),
    
    
]
