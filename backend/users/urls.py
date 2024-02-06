from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import routers
from users import views_alojamientos, views_users
from .views_users import *

router = routers.DefaultRouter()
router.register(r'tipoestablecimientos', views_alojamientos.TipoEstablecimientoViewSet)
router.register(r'establecimientos', views_alojamientos.EstablecimientoViewSet)
router.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)
router.register(r'redesocial', views_alojamientos.RedSocialViewSet)
router.register(r'tiposervicios', views_alojamientos.TipoServicioViewSet)
router.register(r'tipoalojamientos', views_alojamientos.TipoAlojamientoViewSet)
router.register(r'alojamientos', views_alojamientos.AlojamientoViewSet)
router.register(r'pais',views_alojamientos.PaisViewSet)
router.register(r'provincia',views_alojamientos.ProvinciaViewSet)
router.register(r'ciudad',views_alojamientos.CiudadViewSet)

urlpatterns = [
    path('crear_empresario/', crear_empresario, name='crear_empresario'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('obtener_datos_empresario/', obtener_datos_empresario, name='obtener_datos_empresario'),
    path('actualizar-datos-empresario/', actualizar_datos_empresario, name='actualizar_datos_empresario'),
    path('empresarios/', empresario_Lista.as_view(), name='empresario-lista'),
    path('alojamientos/', include(router.urls))]
