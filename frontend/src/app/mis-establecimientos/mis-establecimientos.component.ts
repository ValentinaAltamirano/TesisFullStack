import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GastronomiaService } from '../service/gastronomia.service';
import Swal from 'sweetalert2';
import { ComercioService } from '../service/comercio.service';
@Component({
  selector: 'app-mis-establecimientos',
  templateUrl: './mis-establecimientos.component.html',
  styleUrls: ['./mis-establecimientos.component.css']
})
export class MisEstablecimientosComponent {
  idEmpresario: any;
  baseUrl = 'http://127.0.0.1:8000';
  imagenes: any[] = [];
  noEstablecimientosEncontrados: boolean = false;
  dropdownVisible = false;
  establecimientosAlojamiento: any[] = [];
  establecimientosGastronomia: any[] = [];
  establecimientosComercio: any[] = [];

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
  constructor(private auth: AuthService, private alojamientoService: AlojamientoService, 
              private gastronomiaService: GastronomiaService,
              private comercioService: ComercioService) {}

  ngOnInit(): void {
    this.obtenerAlojamientos();
    this.obtenerGastronomia();
    this.obtenerComercio()
  }

  obtenerAlojamientos(): void {
    this.alojamientoService.getAlojamientoPorIdEmpresario().subscribe(
      (data: any[]) => {
        this.establecimientosAlojamiento = data;
        console.log('Alojamiento obtenido:', this.establecimientosAlojamiento);
  
        const observables: Observable<any>[] = this.establecimientosAlojamiento.map((alojamiento: any) => {
          const establecimientoId = alojamiento.codEstablecimiento;
          return this.alojamientoService.obtenerImagenesAlojamiento(establecimientoId);
        });
  
        forkJoin(observables).subscribe(
          (imagenesArrays: any[]) => {
            imagenesArrays.forEach((imagenesArray: any[], index: number) => {
              this.establecimientosAlojamiento[index].imagenesAlojamientos = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
            });
            console.log('Alojamientos con imágenes:', this.establecimientosAlojamiento);
            this.noEstablecimientosEncontrados = false; // Hay alojamientos encontrados
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
          // No se encontraron alojamientos, la variable ya está en true
        } else {
  
        }
      }
    );
  }
  
  obtenerGastronomia(): void {
    this.gastronomiaService.getGastronomiaPorIdEmpresario().subscribe(
      (data: any[]) => {
        this.establecimientosGastronomia = data;
        console.log('Gastronomia obtenida:', this.establecimientosGastronomia);
  
        const observables: Observable<any>[] = this.establecimientosGastronomia.map((gastronomia: any) => {
          const establecimientoId = gastronomia.codEstablecimiento;
          return this.gastronomiaService.obtenerImagenesGastronomia(establecimientoId);
        });
  
        forkJoin(observables).subscribe(
          (imagenesArrays: any[]) => {
            imagenesArrays.forEach((imagenesArray: any[], index: number) => {
              this.establecimientosGastronomia[index].imagenesGastronomia = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
            });
            console.log('Gastronomía con imágenes:', this.establecimientosGastronomia);
            this.noEstablecimientosEncontrados = false; // Hay gastronomía encontrada
          },
          (error: any) => {
            console.error('Error al obtener imágenes de gastronomia', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al obtener el local gastronomico:', error);
        // Verifica si el error es un HTTP 404 (Not Found)
        if (error instanceof HttpErrorResponse && error.status === 404) {
          // No se encontró gastronomía, la variable ya está en true
        } else {
  
        }
      }
    );
  }

  obtenerComercio(): void {
    this.comercioService.getComercioPorIdEmpresario().subscribe(
      (data: any[]) => {
        this.establecimientosComercio = data;
  
        const observables: Observable<any>[] = this.establecimientosComercio.map((comercio: any) => {
          const establecimientoId = comercio.codEstablecimiento;
          return this.comercioService.obtenerImagenesComercio(establecimientoId);
        });
  
        forkJoin(observables).subscribe(
          (imagenesArrays: any[]) => {
            imagenesArrays.forEach((imagenesArray: any[], index: number) => {
              this.establecimientosComercio[index].imagenesComercios = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
            });
            
            this.noEstablecimientosEncontrados = false; // Hay gastronomía encontrada
          },
          (error: any) => {
            console.error('Error al obtener imágenes de comercio', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al obtener el local comercial:', error);
        // Verifica si el error es un HTTP 404 (Not Found)
        if (error instanceof HttpErrorResponse && error.status === 404) {
          // No se encontró gastronomía, la variable ya está en true
        } else {
  
        }
      }
    );
  }

  eliminarGastronomia(idEstablecimiento: number): void {
    this.gastronomiaService.eliminarEstablecimiento(idEstablecimiento).subscribe(
      () => {
        Swal.fire({
          title: '¿Estás seguro de que quieres eliminar el establecimiento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Lógica para eliminar el establecimiento
            this.gastronomiaService.eliminarEstablecimiento(idEstablecimiento).subscribe(
              () => {
                console.log('Establecimiento gastronómico eliminado con éxito.');
                // Puedes realizar alguna lógica adicional después de la eliminación si es necesario.
              },
              (error: any) => {
                console.error('Error al intentar eliminar el establecimiento gastronómico:', error);
              }
            );
            // Mostrar mensaje de éxito después de la eliminación
            Swal.fire({
              title: 'Establecimiento eliminado',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    );
  }

  eliminarAlojamiento(idEstablecimiento: number): void {
    this.alojamientoService.eliminarEstablecimiento(idEstablecimiento).subscribe(
      () => {
        Swal.fire({
          title: '¿Estás seguro de que quieres eliminar el establecimiento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Lógica para eliminar el establecimiento
            this.alojamientoService.eliminarEstablecimiento(idEstablecimiento).subscribe(
              () => {
                console.log('Alojamiento eliminado con éxito.');
                // Puedes realizar alguna lógica adicional después de la eliminación si es necesario.
              },
              (error: any) => {
                console.error('Error al intentar eliminar el alojamiento:', error);
              }
            );
            // Mostrar mensaje de éxito después de la eliminación
            Swal.fire({
              title: 'Establecimiento eliminado',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              // Actualizar la página después de mostrar el mensaje de éxito
              location.reload();
            });
          }
        });
      }
    );
  }

  eliminarComercio(idEstablecimiento: number): void {
    this.comercioService.eliminarEstablecimiento(idEstablecimiento).subscribe(
      () => {
        Swal.fire({
          title: '¿Estás seguro de que quieres eliminar el establecimiento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Lógica para eliminar el establecimiento
            this.alojamientoService.eliminarEstablecimiento(idEstablecimiento).subscribe(
              () => {
                console.log('Alojamiento eliminado con éxito.');
                // Puedes realizar alguna lógica adicional después de la eliminación si es necesario.
              },
              (error: any) => {
                console.error('Error al intentar eliminar el alojamiento:', error);
              }
            );
            // Mostrar mensaje de éxito después de la eliminación
            Swal.fire({
              title: 'Establecimiento eliminado',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              // Actualizar la página después de mostrar el mensaje de éxito
              location.reload();
            });
          }
        });
      }
    );
  }
}
