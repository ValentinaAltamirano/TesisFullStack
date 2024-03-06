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
  tiposGastronomia: any[] = [];
  tiposComida: any[] = [];
  preferenciaAlimentaria: any[] = [];
  servicios: any[] = [];
  metodosDePago: any[] = [];

   
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

    obtenerMetodosPago(): void {
      this.gastronomiaService.obtenerMetodosDePago().subscribe(
        (data) => {
          this.metodosDePago = data;
        },
        (error) => {
          console.error('Error al obtener tipos de categoria', error);
          // Manejo de errores
        }
      );
    }
    
    obtenerTiposGastronomia(): void {
      this.gastronomiaService.obtenerTiposGastronomia().subscribe(
        (data) => {
          this.tiposGastronomia = data;
        },
        (error) => {
          console.error('Error al obtener tipos de Gastronomía', error);
          // Manejo de errores
        }
      );
    }
  
    obtenerServicioGastronomia(): void {
      this.gastronomiaService.obtenerServicioGastronomia().subscribe(
        (data) => {
          this.servicios = data;
        },
        (error) => {
          console.error('Error al obtener tipos servicio de Gastronomía', error);
          // Manejo de errores
        }
      );
    }
  
    obtenerTipoComida(): void {
      this.gastronomiaService.obtenerTipoComida().subscribe(
        (data) => {
          this.tiposComida = data;
        },
        (error) => {
          console.error('Error al obtener tipos de comida', error);
          // Manejo de errores
        }
      );
    }
  
    obtenerPreferenciaAlimentaria(): void {
      this.gastronomiaService.obtenerPreferenciaAlimentaria().subscribe(
        (data) => {
          this.preferenciaAlimentaria = data;
        },
        (error) => {
          console.error('Error al obtener tipos de preferencia alimentaria', error);
          // Manejo de errores
        }
      );
    }
  
    obtenerMetodosDePago(): void {
      this.gastronomiaService.obtenerMetodosDePago().subscribe(
        (data) => {
          this.metodosDePago = data;
        },
        (error) => {
          console.error('Error al obtener métodos de pago', error);
          // Manejo de errores
        }
      );
    }
    
    ngOnInit() {
      this.obtenerGastronomias();
      this.obtenerTiposGastronomia();
      this.obtenerServicioGastronomia();
      this.obtenerTipoComida();
      this.obtenerPreferenciaAlimentaria();
      this.obtenerMetodosDePago();
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