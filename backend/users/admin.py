from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Empresario)
admin.site.register(Establecimiento)
admin.site.register(MetodoDePago)
admin.site.register(RedSocial)


#imagenes y Relaciones:
admin.site.register(Imagen)
admin.site.register(ImagenXEstablecimiento)
admin.site.register(EstablecimientoXMetodoPago)
admin.site.register(EstablecimientoXRedSocial)

#tipos y Servicios:
admin.site.register(TipoEstablecimiento)
admin.site.register(TipoAlojamiento)
admin.site.register(TipoServicio)

#Alojamientos y servicios:
admin.site.register(Alojamiento)
admin.site.register(AlojamientoXTipoServicio)

#Pais, Provincia y Ciudad:

admin.site.register(Pais)
admin.site.register(Provincia)
admin.site.register(Ciudad)