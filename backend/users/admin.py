from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Empresario)
admin.site.register(MetodoDePago)


#imagenes y Relaciones:
admin.site.register(Imagen)

#tipos y Servicios:
admin.site.register(TipoEstablecimiento)
admin.site.register(TipoAlojamiento)
admin.site.register(TipoServicio)

#Alojamientos y servicios:
admin.site.register(Alojamientos)

#Pais, Provincia y Ciudad:

admin.site.register(Pais)
admin.site.register(Provincia)
admin.site.register(Ciudad)