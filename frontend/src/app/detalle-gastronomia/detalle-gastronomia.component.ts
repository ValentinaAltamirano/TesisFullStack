import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GastronomiaService } from '../service/gastronomia.service';

@Component({
  selector: 'app-detalle-gastronomia',
  templateUrl: './detalle-gastronomia.component.html',
  styleUrls: ['./detalle-gastronomia.component.css']
})
export class DetalleGastronomiaComponent {
  gastronomiaId: number;
  establecimientoId: number; 
  gastronomia: any;
  imagenesGastronomia: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  imagenPrincipal: string = '';
  numeroColumnas: number = 0;

  constructor(private route: ActivatedRoute, private gastronomiaService: GastronomiaService, private http: HttpClient) { 
    this.gastronomiaId = 0;
    this.establecimientoId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      
      this.gastronomiaId = params['id'];
      
      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.cargarDatos()
      
    });
    
    
  }

  cargarDatos() {
    this.gastronomiaService.obtenerGastronomia(this.gastronomiaId).subscribe(
      (detalles) => {
        this.gastronomia = detalles;
        console.log(this.gastronomia)
        this.establecimientoId = this.gastronomia.establecimiento_ptr
        
        this.cargarImagenes(this.establecimientoId);
        this.getLocationCoordinates(`${this.gastronomia.calle } ${this.gastronomia.altura }, Villa Carlos Paz, Córdoba, Argentina`);  
      },
      (error) => {
        console.error('Error al obtener detalles del alojamiento', error);
      }
    );
  }

  cargarImagenes(establecimientoId: number) {
    console.log(this.establecimientoId)
    this.gastronomiaService.obtenerImagenesGastronomia(establecimientoId).subscribe(
      (data) => {
        this.imagenesGastronomia = data;
        // Establecer la imagen principal inicialmente como la primera imagen
        this.imagenPrincipal = this.imagenesGastronomia.length > 0 ? this.imagenesGastronomia[0].imagen : '';
        this.numeroColumnas = Math.ceil(this.imagenesGastronomia.length / 2); // Calcula la mitad de la cantidad de imágenes
        
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }
  
  seleccionarImagenPrincipal(imagen: any) {
    // Cambiar la imagen principal al hacer clic en una miniatura
    this.imagenPrincipal = imagen.imagen;
    console.log('URL de la imagen principal:', this.baseUrl + this.imagenPrincipal);
  }
  
  getLocationCoordinates(address: string) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        this.initMap(location.lat(), location.lng(), results[0].formatted_address);
      } else {
        console.error('Error getting coordinates:', status);
      }
    });
  }

  initMap(latitude: number, longitude: number, locationName: string) {
    const mapElement = document.getElementById('map');

    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong> ${this.gastronomia.nombre} </strong> 
        <br> ${this.gastronomia.codTipoAlojamiento.nombre}
        <br> ${this.gastronomia.calle }  ${this.gastronomia.altura } 
        <br> ${this.gastronomia.codCiudad.nombre}, Córdoba`
      });

      infoWindow.open(map, marker);
    } else {
      console.error("Element with ID 'map' not found.");
    }
  }
}