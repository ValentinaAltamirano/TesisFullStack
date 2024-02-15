import { Component } from '@angular/core';

@Component({
  selector: 'app-gastronomia',
  templateUrl: './gastronomia.component.html',
  styleUrls: ['./gastronomia.component.css']
})
export class GastronomiaComponent {
  // https://www.tripadvisor.com.ar/FindRestaurants?geo=312774&broadened=false
  tiposGastronomia = ['Restaurante', 'Bares y pubs', 'Cafe y te', 'Panaderia y confiteria'];
  tiposComida = ['Desayuno', 'Brunch', 'Almuerzo', 'Cena']
  tipoCocina = ['Parrilla', 'Pizzeria', 'Cafe', 'Comida rápida', 'Sushi', 'Saludable', 'Bar', 'Mexicana']
  restricciones = ['Apto para vegetarianos', 'Opciones sin gluten', 'Opciones veganas']
  servicios = ['Asiento', 'Servicio de mesa', 'Reserva', 'Sirve alchohol','Wi-fi gratis', 'Accesibilidad', 'Comida para llevar']
  metodosDePago = ['Tarjeta de Credito', 'Tarjeta Debito', 'Efectivo', 'Transferencaia']

  locales: any[] = [
                  { 
                  altura: '1093', 
                  calle: 'Boulevard Sarmiento',
                  ciudad: 'Villa Carlos Paz',
                  provincia: 'Córdoba',
                  nombre: 'Ambrogio Restaurante',
                  tipoGastronomia: 'Restaurante',
                  telefono: '+54 3541 42-1200',
                  imagen: '../../assets/ambrogioRestaurante.jpg',
                  web: 'https://www.facebook.com/ambrogio.restaurante',
                  codEstablecimiento: 1,
                  },
                  { 
                  altura: '675', 
                  calle: 'Avenida Illia',
                  ciudad: 'Villa Carlos Paz',
                  provincia: 'Córdoba',
                  nombre: 'Pueblo Mio',
                  tipoGastronomia: 'Restaurante',
                  telefono: '+54 3541 42-0476',
                  imagen: '../../assets/puebloMio.jpg',
                  web: 'https://www.facebook.com/PuebloMioR',
                  codEstablecimiento: 2,
                   }
                ];

}
