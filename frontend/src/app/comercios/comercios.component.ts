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
  comercioForm: FormGroup = new FormGroup({});
  elementosMostrados = {
    tiposComercio: 5
  };

  constructor(
    private comercioService: ComercioService, private fb: FormBuilder,
  ) {
    this.comercioForm = this.fb.group({
      tiposComercioSeleccionados: this.fb.array([])
    });
  }

  getFormControl(formPath: string): FormControl {
    const control = this.comercioForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }

  toggleCheckbox(controlName: string): void {
    const tiposComercioFormArray = this.comercioForm.get('tiposComercioSeleccionados') as FormArray;
  
    const control = this.fb.control(controlName);
  
    // Determinar a cuál FormArray pertenece el control
    let formArray: FormArray;
  
    if (controlName.includes('tiposComercioSeleccionados')) {
      formArray = tiposComercioFormArray;
    } else {
      // Lógica adicional si es necesario manejar otros casos
      return;
    }
  
    if (formArray.value.includes(controlName)) {
      const index = formArray.value.findIndex((item: string) => item === controlName);
      formArray.removeAt(index);
    } else {
      formArray.push(control);
    }
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

  getComerciosFiltrados(): any[] {
    const tiposSeleccionados  = this.comercioForm.get('tiposComercioSeleccionados')?.value;
    
    if (tiposSeleccionados.length === 0 ) {
      return this.comercios;
    }
  
    const comerciosFiltrados = this.comercios.filter((comercio) => {

      const cumpleTipos = tiposSeleccionados.length === 0 || 
      tiposSeleccionados.every(
        (tipo: string) => comercio.codTipoComercio.some(
          (comercioTipo: { nombre: string }) => tipo.includes(`tiposComercioSeleccionados.${comercioTipo.nombre}`)
        )
      );

      console.log(cumpleTipos)
      console.log(tiposSeleccionados)
  
      return cumpleTipos;
    });
    
      return comerciosFiltrados;
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

  mostrarMas(filtro: keyof typeof ComerciosComponent.prototype.elementosMostrados) {
    this.elementosMostrados[filtro] = this[filtro].length;
  }

  mostrarMenos(filtro: keyof typeof ComerciosComponent.prototype.elementosMostrados) {
    this.elementosMostrados[filtro] = 5; // Puedes ajustar a la cantidad que desees mostrar inicialmente
  }
}
