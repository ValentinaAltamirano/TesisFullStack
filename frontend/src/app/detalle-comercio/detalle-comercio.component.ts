import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../service/alojamiento.service';
import { HttpClient } from '@angular/common/http';
import { ComercioService } from '../service/comercio.service';

@Component({
  selector: 'app-detalle-comercio',
  templateUrl: './detalle-comercio.component.html',
  styleUrls: ['./detalle-comercio.component.css']
})
export class DetalleComercioComponent {
  establecimientoId: number;
  comercio: any;
  imagenesComercio: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  imagenPrincipal: string = '';
  numeroColumnas: number = 0;


  constructor(private route: ActivatedRoute, private comercioService: ComercioService, private http: HttpClient) { 
    this.establecimientoId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      
      this.establecimientoId = params['id'];
      
      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.cargarDatos()
      this.cargarImagenes();
      
    });
    
    
  }


  cargarDatos() {
    this.comercioService.obtenerComercio(this.establecimientoId).subscribe(
      (detalles) => {
        this.comercio = detalles;
        console.log(this.comercio);
        this.getLocationCoordinates(`${this.comercio.calle } ${this.comercio.altura }, Villa Carlos Paz, Córdoba, Argentina`);  
      },
      (error) => {
        console.error('Error al obtener detalles del alojamiento', error);
      }
    );
  }

  cargarImagenes() {
    this.comercioService.obtenerImagenesComercio(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesComercio = data;
        // Establecer la imagen principal inicialmente como la primera imagen
        this.imagenPrincipal = this.imagenesComercio.length > 0 ? this.imagenesComercio[0].imagen : '';
        this.numeroColumnas = Math.ceil(this.imagenesComercio.length / 2); // Calcula la mitad de la cantidad de imágenes
        
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
        content: `<strong> ${this.comercio.nombre} </strong> 
        <br> ${this.comercio.calle }  ${this.comercio.altura } 
        <br> Villa Carlos Paz, Córdoba`
      });

      infoWindow.open(map, marker);
    } else {
      console.error("Element with ID 'map' not found.");
    }
  }
}
