from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import routers
from users import views_alojamientos, views_gastronomia, views_comercio, views_turista, views_empresario
from .views_empresario import *  
from .views_alojamientos import *  
from .views_gastronomia import *  
from .views_turista import * 
from .views_comercio import *
from django.conf import settings
from django.conf.urls.static import static

# Define los routers para gastronomía
router_gastronomiasCampos = routers.DefaultRouter()
router_gastronomiasCampos.register(r'tipogastronomia', views_gastronomia.TipoGastronomiaViewSet)
router_gastronomiasCampos.register(r'serviciosGastronomia', views_gastronomia.TipoServGastroViewSet)
router_gastronomiasCampos.register(r'tipocomida', views_gastronomia.TipoComidaViewSet)
router_gastronomiasCampos.register(r'preferenciaAlimentaria', views_gastronomia.TipoPrefAlimentViewSet)
router_gastronomiasCampos.register(r'pais', views_alojamientos.PaisViewSet)
router_gastronomiasCampos.register(r'provincia', views_alojamientos.ProvinciaViewSet)
router_gastronomiasCampos.register(r'ciudad', views_alojamientos.CiudadViewSet)
router_gastronomiasCampos.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)

router_gastronomias = routers.DefaultRouter()
router_gastronomias.register(r'', GastronomiaViewSet, basename='gastronomia')

# Define el router para las vistas de los alojamientos
router_alojamientosCampos = routers.DefaultRouter()
router_alojamientosCampos.register(r'tipoestablecimientos', views_alojamientos.TipoEstablecimientoViewSet)
router_alojamientosCampos.register(r'metodospago', views_alojamientos.MetodoDePagoViewSet)
router_alojamientosCampos.register(r'tiposervicios', views_alojamientos.TipoServicioViewSet)
router_alojamientosCampos.register(r'tipoalojamientos', views_alojamientos.TipoAlojamientoViewSet)
router_alojamientosCampos.register(r'pais', views_alojamientos.PaisViewSet)
router_alojamientosCampos.register(r'provincia', views_alojamientos.ProvinciaViewSet)
router_alojamientosCampos.register(r'ciudad', views_alojamientos.CiudadViewSet)
router_alojamientosCampos.register(r'categoria', views_alojamientos.CategoriaViewSet)

router_alojamientos = routers.DefaultRouter()
router_alojamientos.register(r'', AlojamientoViewSet, basename='alojamientos')

# Define el router para las vistas del comercio
router_comerciosCampos = routers.DefaultRouter()
router_comerciosCampos.register(r'metodospago', views_comercio.MetodoDePagoViewSet)
router_comerciosCampos.register(r'tipocomercio', views_comercio.TipoComercioViewSet)

router_comercios = routers.DefaultRouter()
router_comercios.register(r'', ComercioViewSet, basename='comercio')

# Define el router para las vistas del empresario
router_user = routers.DefaultRouter()
router_user.register(r'', views_empresario.EmpresarioViewSet, basename='empresarios')

# Define el router para las vistas del turista
router_turista = routers.DefaultRouter()
router_turista.register(r'', views_turista.TuristaViewSet, basename='turistas')

router_comentarios = routers.DefaultRouter()
router_comentarios.register(r'', views_turista.ComentarioViewSet, basename='comentarios')


router_imagenesPefil = routers.DefaultRouter()
router_imagenesPefil.register(r'', views_turista.ImagenPerfilViewSet, basename='imagenPerfil')


# Lista de URL conf para las vistas de la aplicación
urlpatterns = [
    # Rutas relacionadas con usuarios
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Rutas para gastronomía
    path('gastronomias/', include(router_gastronomias.urls)),
    path('gastronomiasCampos/', include(router_gastronomiasCampos.urls)),

    # Rutas para alojamientos
    
    path('alojamientosCampos/', include(router_alojamientosCampos.urls)),
    path('alojamientos/', include(router_alojamientos.urls)),

    # Rutas para empresario
    path('empresarios/', include(router_user.urls)),

    # Rutas para comercios
     path('comercios/', include(router_comercios.urls)),
    path('comerciosCampos/', include(router_comerciosCampos.urls)),

    # Rutas para el turista
    path('turistas/', include(router_turista.urls)),
    path('comentarios/', include(router_comentarios.urls)),

    # Rutas para cargar y obtener imágenes de alojamientos
    path('imagenesAlojamiento/<int:alojamiento_id>/', ImagenAlojamientoCreateView.as_view(), name='imagenes_alojamiento'),
    path('imagenesGastronomia/<int:establecimiento_id>/', ImagenGastronomiaCreateView.as_view(), name='setImagenesGastronomia'),
    path('imagenesComercios/<int:establecimiento_id>/', ImagenComercioCreateView.as_view(), name='setImagenesComercio'),
    
    path('imagenesPerfil/', include(router_imagenesPefil.urls)),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Si el modo DEBUG está activado, sirve las rutas para los archivos multimedia
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)