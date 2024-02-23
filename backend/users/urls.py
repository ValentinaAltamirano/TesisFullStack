from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import routers
from users import views_alojamientos, views_users, views_gastronomia, views_comercio  # Importa las vistas necesarias
from .views_users import *  # Importa todas las vistas relacionadas con usuarios
from .views_alojamientos import *  # Importa todas las vistas relacionadas con alojamientos
from .views_gastronomia import *  # Importa todas las vistas relacionadas con gastronomía
from .views_comercio import * # Importa todas las vistas relacionadas con Comercio
from django.conf import settings
from django.conf.urls.static import static

# Define los routers para gastronomía y alojamientos
router_gastronomia = routers.DefaultRouter()
router_gastronomia.register(r'tipogastronomia', views_gastronomia.TipoGastronomiaViewSet)
router_gastronomia.register(r'tiposervgastro', views_gastronomia.TipoServGastroViewSet)
router_gastronomia.register(r'tipocomida', views_gastronomia.TipoComidaViewSet)
router_gastronomia.register(r'tipoprefaliment', views_gastronomia.TipoPrefAlimentViewSet)
router_gastronomia.register(r'list_gastronomia', views_gastronomia.GastronomiaViewSet, basename='gastronomia')

router_alojamientos = routers.DefaultRouter()
router_alojamientos.register(r'tipoestablecimientos', views_alojamientos.TipoEstablecimientoViewSet)
router_alojamientos.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)
router_alojamientos.register(r'tiposervicios', views_alojamientos.TipoServicioViewSet)
router_alojamientos.register(r'tipoalojamientos', views_alojamientos.TipoAlojamientoViewSet)
router_alojamientos.register(r'list_alojamientos', views_alojamientos.AlojamientoViewSet, basename='alojamientos')
router_alojamientos.register(r'pais', views_alojamientos.PaisViewSet)
router_alojamientos.register(r'provincia', views_alojamientos.ProvinciaViewSet)
router_alojamientos.register(r'ciudad', views_alojamientos.CiudadViewSet)
router_alojamientos.register(r'categoria', views_alojamientos.CategoriaViewSet)

router_comercios = routers.DefaultRouter()
router_comercios.register(r'tipocomercio', views_comercio.TipoComercioViewSet)
router_comercios.register(r'list_comercio', views_comercio.ComercioViewSet, basename='comercio')


# Lista de URL conf para las vistas de la aplicación
urlpatterns = [
    # Rutas relacionadas con usuarios
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Rutas para gastronomía
    path('Gastronomia', include(router_gastronomia.urls)),

    # Rutas para alojamientos
    path('Alojamientos', include(router_alojamientos.urls)),

    # Rutas para comercios
    path('Comercios', include(router_comercios.urls)),


    # Rutas para cargar y obtener imágenes de alojamientos
    path('registrar-imagenes/<int:alojamiento_id>/', ImagenAlojamientoCreateView.as_view(), name='cargar_imagenes_alojamiento'),
    path('imagenes-alojamiento/<int:alojamiento_id>/', ImagenAlojamientoCreateView.as_view(), name='imagenes_alojamiento'),
]

# Si el modo DEBUG está activado, sirve las rutas para los archivos multimedia
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

