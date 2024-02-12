import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-alojamiento',
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent {
  tiposAlojamiento: any[] = [];
  tiposCategoria: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  alojamientos: any[] = [];
  imagenes: any[] = [];
  establecimientoId: number = 0;
  baseUrl = 'http://127.0.0.1:8000';

  obtenerTiposAlojamiento(): void {
    this.alojamientoService.obtenerTiposAlojamiento().subscribe(
      (data) => {
        this.tiposAlojamiento = data;
      },
      (error) => {
        console.error('Error al obtener tipos de alojamiento', error);
        // Manejo de errores
      }
    );
  }

  obtenerCategoria(): void {
    this.alojamientoService.obtenerCategoria().subscribe(
      (data) => {
        this.tiposCategoria = data;
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }

  obtenerServicio(): void {
    this.alojamientoService.obtenerServicios().subscribe(
      (data) => {
        this.tiposServicio = data;
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }

  obtenerMetodosPago(): void {
    this.alojamientoService.obtenerMetodosDePago().subscribe(
      (data) => {
        this.tiposmetodosPago = data;
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }

  constructor(
    private fb: FormBuilder,
    private alojamientoService: AlojamientoService,
    private router: Router,
  ) {}

  

  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();

    this.alojamientoService.getTodosAlojamientos().subscribe(
      (data) => {
        this.alojamientos = data;
    
        const observables = this.alojamientos.map(alojamiento => {
          const establecimientoId = alojamiento.codEstablecimiento;
          return this.alojamientoService.obtenerImagenesAlojamiento(establecimientoId);
        });

        console.log(this.alojamientos);

    
        forkJoin(observables).subscribe(
          (imagenesArrays) => {
    
            // Ahora imagenesArrays contiene un array de imágenes para cada alojamiento
    
            // Puedes obtener la primera imagen de cada array
            imagenesArrays.forEach((imagenesArray, index) => {
              // Agregar las imágenes al array de imágenes del alojamiento correspondiente
              this.alojamientos[index].imagenesAlojamientos = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
              
            });
            
          },
          (error) => {
            console.error('Error al obtener imágenes de alojamientos', error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );

    
  }
}