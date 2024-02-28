import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { GastronomiaService } from '../service/gastronomia.service';

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

  
  gastronomias: any[] = [];
  imagenes: any[] = [];
  establecimientoId: number = 0;
  baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private gastronomiaService: GastronomiaService, private fb: FormBuilder,
  ) {}

  getAlojamientosFiltrados(): any[] {
    
    return this.gastronomias;

    }

    ngOnInit() {
      this.obtenerGastronomias();
    }
  
    obtenerGastronomias() {
      this.gastronomiaService.getTodosGastronomia().subscribe(
        (data) => {
          this.gastronomias = data;
          console.log(this.gastronomias);
  
          const observables = this.gastronomias.map(gastronomia => {
            const establecimientoId = gastronomia.codEstablecimiento;
            return this.gastronomiaService.obtenerImagenesGastronomia(establecimientoId);
          });
  
          forkJoin(observables).subscribe(
            (imagenesArrays) => {
              imagenesArrays.forEach((imagenesArray, index) => {
                this.gastronomias[index].imagenesGastronomia = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
              });
            },
            (error) => {
              console.error('Error al obtener imágenes del local gastronómico', error);
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }