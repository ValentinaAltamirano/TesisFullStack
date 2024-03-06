import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  baseUrl = 'http://127.0.0.1:8000';
  constructor(private router: Router) { }

  displayAlojamientosOnMap(alojamientos: any[]) {
    const geocoder = new google.maps.Geocoder();
    const mapElement = document.getElementById('map');
  
    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: -31.41, lng: -64.50567 },
        zoom: 13
      });
  
      let infoWindow: google.maps.InfoWindow | null = null; // Variable para almacenar el InfoWindow actual
      
      
      alojamientos.forEach((alojamiento: any) => {
        console.log(alojamiento);
        const infoWindowContent = document.createElement('div');
        
        this.getLocationCoordinates(geocoder, `${alojamiento.calle} ${alojamiento.altura}, Villa Carlos Paz, Córdoba, Argentina`, (location) => {
          const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: alojamiento.nombre
          });
  
          if (alojamiento.imagenesAlojamientos && alojamiento.imagenesAlojamientos.length > 0) {
            
            console.log(alojamiento.imagenesAlojamientos[0].imagen);

            const imageElement = document.createElement('img');
            imageElement.src = this.baseUrl + alojamiento.imagenesAlojamientos[0].imagen;
            imageElement.alt = 'Imagen del establecimiento';
            imageElement.style.width = '160px';
            infoWindowContent.appendChild(imageElement);
          }
  
          infoWindowContent.innerHTML += `
          <h1 class="text-center font-bold text-gray-700 p-1">${alojamiento.nombre}</h1>
          <h2 class=" text-gray-700 font-bold">${alojamiento.codTipoAlojamiento.nombre} </h2>
          <p class=" text-gray-700">${alojamiento.calle} ${alojamiento.altura} </p>
          <p class=" text-gray-700">${alojamiento.codCiudad.nombre}, Córdoba </p>
          <button style="margin:0.8rem 3rem; padding:0.4rem; background-color: rgb(220 38 38); color: white;">
          <a href="/detalle-alojamiento/${alojamiento.codEstablecimiento}" >Ver más</a></button>
        `;
  
          marker.addListener('click', () => {
            // Cierra el InfoWindow actual si está abierto
            if (infoWindow) {
              infoWindow.close();
            }
  
            // Crea un nuevo InfoWindow y ábrelo
            infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });
            infoWindow.open(map, marker);
          });
        });
      });
    } else {
      console.error("Element with ID 'map' not found.");
    }
  }

  getLocationCoordinates(geocoder: any, address: string, callback: (location: { lat: number, lng: number }) => void) {
    geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        callback({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error('Error getting coordinates:', status);
      }
    });
  }

  
}