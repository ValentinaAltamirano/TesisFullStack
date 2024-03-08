from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Empresario)
admin.site.register(MetodoDePago)

# Imágenes y relaciones
admin.site.register(Imagen)

# Tipos y servicios
admin.site.register(TipoEstablecimiento)
admin.site.register(TipoAlojamiento)
admin.site.register(TipoServicio)
admin.site.register(Categoria)

# Alojamientos y servicios
admin.site.register(Alojamientos)


# Gastronomía
admin.site.register(TipoGastronomia)
admin.site.register(TipoServGastro)
admin.site.register(TipoComida)
admin.site.register(TipoPrefAliment)
admin.site.register(Gastronomia)

# País, Provincia y Ciudad
admin.site.register(Pais)
admin.site.register(Provincia)
admin.site.register(Ciudad)

#Comercio

admin.site.register(Comercio)
admin.site.register(TipoComercio)

#Turista
admin.site.register(ImagenPerfil)
admin.site.register(Turista)
admin.site.register(Comentario)

