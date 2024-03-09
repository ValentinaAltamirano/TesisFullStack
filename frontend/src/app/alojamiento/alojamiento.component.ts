import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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
  alojamientoForm: FormGroup = new FormGroup({});

  elementosMostrados = {
    tiposAlojamiento: 5,
    tiposServicio: 5
  };

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
    private alojamientoService: AlojamientoService, private fb: FormBuilder,
  ) {
    this.alojamientoForm = this.fb.group({
      tiposAlojamientoSeleccionados: this.fb.array([]),
      serviciosSeleccionados: this.fb.array([]),
      categoriasSeleccionadas: this.fb.array([]),
    });
  }

  getFormControl(formPath: string): FormControl {
    const control = this.alojamientoForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }

  toggleCheckbox(controlName: string): void {
    const tiposAlojamientoFormArray = this.alojamientoForm.get('tiposAlojamientoSeleccionados') as FormArray;
    const serviciosFormArray = this.alojamientoForm.get('serviciosSeleccionados') as FormArray;
    const categoriasFormArray = this.alojamientoForm.get('categoriasSeleccionadas') as FormArray;
  
    const control = this.fb.control(controlName);
  
    // Determinar a cuál FormArray pertenece el control
    let formArray: FormArray;
  
    if (controlName.includes('tiposAlojamientoSeleccionados')) {
      formArray = tiposAlojamientoFormArray;
    } else if (controlName.includes('serviciosSeleccionados')) {
      formArray = serviciosFormArray;
    } else if (controlName.includes('categoriasSeleccionadas')) {
      formArray = categoriasFormArray;
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
  
  getAlojamientosFiltrados(): any[] {
  const tiposSeleccionados = this.alojamientoForm.get('tiposAlojamientoSeleccionados')?.value;
  const serviciosSeleccionados = this.alojamientoForm.get('serviciosSeleccionados')?.value;
  const categoriasSeleccionadas = this.alojamientoForm.get('categoriasSeleccionadas')?.value;
  
  if (tiposSeleccionados.length === 0 && serviciosSeleccionados.length === 0 && categoriasSeleccionadas.length === 0) {
    // Si no se han seleccionado tipos de alojamiento, servicios ni categorías, devolver todos los alojamientos
    return this.alojamientos;
  }

  const alojamientosFiltrados = this.alojamientos.filter((alojamiento) => {
    
    const cumpleTipos = tiposSeleccionados.length === 0 || tiposSeleccionados.some(
      (tipo: string) => tipo === `tiposAlojamientoSeleccionados.${alojamiento.codTipoAlojamiento.nombre}`
    );

    const cumpleCategorias = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.every(
      (categoria: string) => categoria === `categoriasSeleccionadas.${alojamiento.codCategoria.nombre}`
    );

    const cumpleServicios = serviciosSeleccionados.length === 0 || 
      serviciosSeleccionados.every(
        (servicio: string) => alojamiento.servicios.some(
          (alojamientoServicio: { nombre: string }) => servicio.includes(`serviciosSeleccionados.${alojamientoServicio.nombre}`)
        )
      );

    return cumpleTipos && cumpleCategorias && cumpleServicios;
  });
  
    return alojamientosFiltrados;
  }

  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();

    this.alojamientoService.getTodosAlojamientos().subscribe(
      (data) => {
        this.alojamientos = data;
        console.log(this.alojamientos)
    
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

  mostrarMas(filtro: keyof typeof AlojamientoComponent.prototype.elementosMostrados) {
    this.elementosMostrados[filtro] = this[filtro].length;
  }

  mostrarMenos(filtro: keyof typeof AlojamientoComponent.prototype.elementosMostrados) {
    this.elementosMostrados[filtro] = 5; // Puedes ajustar a la cantidad que desees mostrar inicialmente
  }
}