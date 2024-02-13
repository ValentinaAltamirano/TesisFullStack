import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../service/alojamiento.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-detalle-alojamiento',
  templateUrl: './detalle-alojamiento.component.html',
  styleUrls: ['./detalle-alojamiento.component.css']
})
export class DetalleAlojamientoComponent {
  establecimientoId: number;
  alojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  imagenPrincipal: string = '';
  numeroColumnas: number = 0;
  private apiKey = 'AIzaSyDnh8zPYqYEx1d1kNOYUWvCQZVgR4XW4so';

  constructor(private route: ActivatedRoute, private alojamientoService: AlojamientoService, private http: HttpClient) { 
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
    this.alojamientoService.obtenerAlojamiento(this.establecimientoId).subscribe(
      (detalles) => {
        this.alojamiento = detalles;
        console.log(this.alojamiento);
        this.getLocationCoordinates(`${this.alojamiento.calle } ${this.alojamiento.altura }, Villa Carlos Paz, Córdoba, Argentina`);  
      },
      (error) => {
        console.error('Error al obtener detalles del alojamiento', error);
      }
    );
  }

  cargarImagenes() {
    this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesAlojamiento = data;
        // Establecer la imagen principal inicialmente como la primera imagen
        this.imagenPrincipal = this.imagenesAlojamiento.length > 0 ? this.imagenesAlojamiento[0].imagen : '';
        this.numeroColumnas = Math.ceil(this.imagenesAlojamiento.length / 2); // Calcula la mitad de la cantidad de imágenes
        
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
        content: `<strong> ${this.alojamiento.nombre} </strong> 
        <br> ${this.alojamiento.codTipoAlojamiento.nombre}
        <br> ${this.alojamiento.calle }  ${this.alojamiento.altura } 
        <br> ${this.alojamiento.codCiudad.nombre}, Córdoba`
      });

      infoWindow.open(map, marker);
    } else {
      console.error("Element with ID 'map' not found.");
    }
  }
}