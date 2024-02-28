import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ComercioService } from '../service/comercio.service';

@Component({
  selector: 'app-comercios',
  templateUrl: './comercios.component.html',
  styleUrls: ['./comercios.component.css']
})
export class ComerciosComponent {

  tiposComercio: any[] = [];
  tiposmetodosPago: any[] = [];
  comercios: any[] = [];
  imagenes: any[] = [];
  establecimientoId: number = 0;
  baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private comercioService: ComercioService, private fb: FormBuilder,
  ) {
  }

  obtenerTiposComercios(): void {
    this.comercioService.obtenerTiposComercio().subscribe(
      (data) => {
        this.tiposComercio = data;
      },
      (error) => {
        console.error('Error al obtener tipos de comercio', error);
        // Manejo de errores
      }
    );
  }

  obtenerMetodosPago(): void {
    this.comercioService.obtenerMetodosDePago().subscribe(
      (data) => {
        this.tiposmetodosPago = data;
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }


  ngOnInit() {
    
    this.obtenerTiposComercios();
    this.obtenerMetodosPago();
    this.obtenerComercios();
  }

  obtenerComercios() {
    this.comercioService.getTodosComercios().subscribe(
      (data) => {
        this.comercios = data;
        console.log(this.comercios);

        const observables = this.comercios.map(comercios => {
          const establecimientoId = comercios.codEstablecimiento;
          return this.comercioService.obtenerImagenesComercio(establecimientoId);
        });

        forkJoin(observables).subscribe(
          (imagenesArrays) => {
            imagenesArrays.forEach((imagenesArray, index) => {
              this.comercios[index].imagenesComercio = imagenesArray.length > 0 ? [imagenesArray[0]] : [];
            });
          },
          (error) => {
            console.error('Error al obtener imágenes del comercio', error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
