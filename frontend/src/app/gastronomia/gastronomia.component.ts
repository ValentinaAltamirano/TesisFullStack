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
  gastronomiaForm: FormGroup = new FormGroup({});
  gastronomias: any[] = [];
  imagenes: any[] = [];
  establecimientoId: number = 0;
  baseUrl = 'http://127.0.0.1:8000';
  
  elementosMostrados = {
    tiposGastronomia: 5,
    tiposComida: 5,
    preferenciaAlimentaria: 5,
    servicios: 5
  };

  constructor(
    private gastronomiaService: GastronomiaService, private fb: FormBuilder,
  ) {
    this.gastronomiaForm = this.fb.group({
      tiposGastronomiaSeleccionados: this.fb.array([]),
      tiposComidaSeleccionados: this.fb.array([]),
      preferenciaAlimentariaSeleccionada: this.fb.array([]),
      serviciosSeleccionados: this.fb.array([]),
    });
  }

  getGastronomiaFiltradas(): any[] {
    const tiposGastronomiaSeleccionados = this.gastronomiaForm.get('tiposGastronomiaSeleccionados')?.value || [];
    const tiposComidaSeleccionados = this.gastronomiaForm.get('tiposComidaSeleccionados')?.value || [];
    const preferenciaAlimentariaSeleccionada = this.gastronomiaForm.get('preferenciaAlimentariaSeleccionada')?.value || [];
    const serviciosSeleccionados = this.gastronomiaForm.get('serviciosSeleccionados')?.value || [];
    
    // Lógica para filtrar gastronomías según las selecciones
    if (tiposGastronomiaSeleccionados.length === 0 &&
      serviciosSeleccionados.length === 0 &&
      tiposComidaSeleccionados.length === 0 &&
      preferenciaAlimentariaSeleccionada.length === 0 ) {
      // Si no se han seleccionado tipos de alojamiento, servicios ni categorías, devolver todos los alojamientos
      return this.gastronomias;
    }
    
    const gastronomiasFiltradas = this.gastronomias.filter((gastronomia) => {

      const cumpleTipos = tiposGastronomiaSeleccionados.length === 0 || tiposGastronomiaSeleccionados.every(
        (tipo: any) => gastronomia.tipos_gastronomia.some(
          (gastronomiaTipo: any) => tipo === `tiposGastronomiaSeleccionados.${gastronomiaTipo.nombre}`
        )
      );

      const cumpleTiposComida = tiposComidaSeleccionados.length === 0 || tiposComidaSeleccionados.every(
        (tipo: any) => gastronomia.tipos_comida.some(
          (gastronomiaTipoComida: any) => tipo === `tiposComidaSeleccionados.${gastronomiaTipoComida.nombre}`
        )
      );

      const cumplePreferenciaAlimentaria = preferenciaAlimentariaSeleccionada.length === 0 || preferenciaAlimentariaSeleccionada.every(
        (preferencia: any) => gastronomia.tipos_pref_alimentaria.some(
          (gastronomiaPreferencia: any) => preferencia === `preferenciaAlimentariaSeleccionada.${gastronomiaPreferencia.nombre}`
        )
      );

      const cumpleServicios = serviciosSeleccionados.length === 0 || serviciosSeleccionados.every(
        (servicio: any) => gastronomia.tipos_servicio_gastronomico.some(
          (gastronomiaServicio: any) => servicio === `serviciosSeleccionados.${gastronomiaServicio.nombre}`
        )
      );


      return cumpleTipos && cumpleTiposComida && cumplePreferenciaAlimentaria && cumpleServicios;
    });
    
      return gastronomiasFiltradas;
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

    toggleCheckbox(controlName: string): void {
      const tiposGastronomiaFormArray = this.gastronomiaForm.get('tiposGastronomiaSeleccionados') as FormArray;
      const serviciosFormArray = this.gastronomiaForm.get('serviciosSeleccionados') as FormArray;
      const tiposComidasFormArray = this.gastronomiaForm.get('tiposComidaSeleccionados') as FormArray;
      const preferenciasAlimentariasFormArray = this.gastronomiaForm.get('preferenciaAlimentariaSeleccionada') as FormArray;
        
      const control = this.fb.control(controlName);
        
      // Determinar a cuál FormArray pertenece el control
      let formArray: FormArray;
        
      if (controlName.includes('tiposGastronomiaSeleccionados')) {
        formArray = tiposGastronomiaFormArray;
      } else if (controlName.includes('serviciosSeleccionados')) {
        formArray = serviciosFormArray;
      } else if (controlName.includes('tiposComidaSeleccionados')) {
        formArray = tiposComidasFormArray;
      } else if (controlName.includes('preferenciaAlimentariaSeleccionada')) {
        formArray = preferenciasAlimentariasFormArray;
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

    getFormControl(formPath: string): FormControl {
      const control = this.gastronomiaForm.get(formPath) as FormControl;
      return control || new FormControl(null);
    }

    mostrarMas(filtro: keyof typeof GastronomiaComponent.prototype.elementosMostrados) {
      this.elementosMostrados[filtro] = this[filtro].length;
    }
  
    mostrarMenos(filtro: keyof typeof GastronomiaComponent.prototype.elementosMostrados) {
      this.elementosMostrados[filtro] = 5; // Puedes ajustar a la cantidad que desees mostrar inicialmente
    }
  }