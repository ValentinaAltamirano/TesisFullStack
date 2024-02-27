import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mis-establecimientos',
  templateUrl: './mis-establecimientos.component.html',
  styleUrls: ['./mis-establecimientos.component.css']
})
export class MisEstablecimientosComponent {
  idEmpresario: any;
  establecimientos: any;
  baseUrl = 'http://127.0.0.1:8000';
  imagenes: any[] = [];
  noEstablecimientosEncontrados: boolean = false;
  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
  constructor(private auth: AuthService, private establecimientoService: AlojamientoService) {}

  ngOnInit(): void {
      this.establecimientoService.getAlojamientoPorIdEmpresario().subscribe(
        (data: any[]) => {
          this.establecimientos = data;
          console.log('Alojamiento obtenido:', this.establecimientos);

          const observables: Observable<any>[] = this.establecimientos.map((alojamiento: any) => {
            const establecimientoId = alojamiento.codEstablecimiento;
            return this.establecimientoService.obtenerImagenesAlojamiento(establecimientoId);
          });

          forkJoin(observables).subscribe(
            (imagenesArrays: any[]) => {
              imagenesArrays.forEach((imagenesArray: any[], index: number) => {
                this.establecimientos[index].imagenesAlojamientos = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
              });
              console.log('Alojamientos con imágenes:', this.establecimientos);
            },
            (error: any) => {
              console.error('Error al obtener imágenes de alojamientos', error);
            }
          );

        },
        (error: any) => {
          console.error('Error al obtener el alojamiento:', error);
          // Verifica si el error es un HTTP 404 (Not Found)
          if (error instanceof HttpErrorResponse && error.status === 404) {
            this.noEstablecimientosEncontrados = true;
          } else {

          }
        }
      );
  }
}
