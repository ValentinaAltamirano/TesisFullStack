import { Component, OnInit,ElementRef  } from '@angular/core';
import { GastronomiaService } from '../service/gastronomia.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { ComercioService } from '../service/comercio.service';
import { MapService } from '../map.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  gastronomias: any[] = [];
  alojamientos: any[] = [];
  comercios: any[] = [];

  constructor(private elementRef: ElementRef, private gastronomiaService: GastronomiaService, private alojamientoService: AlojamientoService, private comercioService: ComercioService, private mapService: MapService ) {  
  }

  ngOnInit() {
    this.obtenerGastronomias();
    this.obtenerAlojamientos();
    this.obtenerComercios();
  }

  obtenerGastronomias() {
    
  }

  obtenerAlojamientos() {
    
    this.alojamientoService.getTodosAlojamientos().subscribe(
          (data) => {
            this.alojamientos = data;
            console.log(this.alojamientos)
            const observables = this.alojamientos.map(alojamiento => {
              const establecimientoId = alojamiento.codEstablecimiento;
              return this.alojamientoService.obtenerImagenesAlojamiento(establecimientoId);
            });
    
        
            forkJoin(observables).subscribe(
              (imagenesArrays) => {
        
                // Ahora imagenesArrays contiene un array de imágenes para cada alojamiento
        
                // Puedes obtener la primera imagen de cada array
                imagenesArrays.forEach((imagenesArray, index) => {
                  // Agregar las imágenes al array de imágenes del alojamiento correspondiente
                  this.alojamientos[index].imagenesAlojamientos = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
                  this.mapService.displayAlojamientosOnMap(this.alojamientos);

                  this.gastronomiaService.getTodosGastronomia().subscribe(
                    (data) => {
                      this.gastronomias = data;
                    },
                    (error) => {
                      console.error(error);
                    }
                  );

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

  obtenerComercios() {
    this.comercioService.getTodosComercios().subscribe(
      (data) => {
        this.comercios = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}