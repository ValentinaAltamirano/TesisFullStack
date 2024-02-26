from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import routers
from users import views_alojamientos, views_users, views_gastronomia, views_comercio, views_turista  
from .views_users import *  
from .views_alojamientos import *  
from .views_gastronomia import *  
from .views_turista import * 
from django.conf import settings
from django.conf.urls.static import static

# Define los routers para gastronomía
router_gastronomia = routers.DefaultRouter()
router_gastronomia.register(r'tipogastronomia', views_gastronomia.TipoGastronomiaViewSet)
router_gastronomia.register(r'tiposervgastro', views_gastronomia.TipoServGastroViewSet)
router_gastronomia.register(r'tipocomida', views_gastronomia.TipoComidaViewSet)
router_gastronomia.register(r'tipoprefaliment', views_gastronomia.TipoPrefAlimentViewSet)
router_gastronomia.register(r'pais', views_alojamientos.PaisViewSet)
router_gastronomia.register(r'provincia', views_alojamientos.ProvinciaViewSet)
router_gastronomia.register(r'ciudad', views_alojamientos.CiudadViewSet)
router_gastronomia.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)

# Define el router para las vistas de los alojamientos
router_alojamientos = routers.DefaultRouter()
router_alojamientos.register(r'tipoestablecimientos', views_alojamientos.TipoEstablecimientoViewSet)
router_alojamientos.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)
router_alojamientos.register(r'tiposervicios', views_alojamientos.TipoServicioViewSet)
router_alojamientos.register(r'tipoalojamientos', views_alojamientos.TipoAlojamientoViewSet)
router_alojamientos.register(r'pais', views_alojamientos.PaisViewSet)
router_alojamientos.register(r'provincia', views_alojamientos.ProvinciaViewSet)
router_alojamientos.register(r'ciudad', views_alojamientos.CiudadViewSet)
router_alojamientos.register(r'categoria', views_alojamientos.CategoriaViewSet)


# Define el router para las vistas del comercio
router_comercios = routers.DefaultRouter()
router_comercios.register(r'tipocomercio', views_comercio.TipoComercioViewSet)

# Define el router para las vistas del empresario
router_user = routers.DefaultRouter()
router_user.register(r'', views_users.EmpresarioViewSet, basename='empresarios')

# Define el router para las vistas del turista
router_turista = routers.DefaultRouter()
router_turista.register(r'', views_turista.TuristaViewSet, basename='turistas')
router_turista.register(r'comentario', views_turista.ComentarioViewSet)


# Lista de URL conf para las vistas de la aplicación
urlpatterns = [
    # Rutas relacionadas con usuarios
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Rutas para gastronomía
    path('gastronomias/', views_gastronomia.GastronomiaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('gastronomiasCampos/', include(router_gastronomia.urls)),

    # Rutas para alojamientos
    path('alojamientos/', views_alojamientos.AlojamientoViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('alojamientosCampos/', include(router_alojamientos.urls)),

    # Rutas para empresario
    path('empresarios/', include(router_user.urls)),

    # Rutas para comercios
    path('comercios/', views_comercio.ComercioViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('alojamientosCampos/', include(router_comercios.urls)),

    # Rutas para el turista
    path('turistas/', include(router_turista.urls)),


    # Rutas para cargar y obtener imágenes de alojamientos
    path('imagenesAlojamiento/<int:alojamiento_id>/', ImagenAlojamientoCreateView.as_view(), name='imagenes_alojamiento'),
    path('imagenesGastronomia/<int:gastronomia_id>/', ImagenGastronomiaCreateView.as_view(), name='setImagenesGastronomia'),
    
]

# Si el modo DEBUG está activado, sirve las rutas para los archivos multimedia
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)