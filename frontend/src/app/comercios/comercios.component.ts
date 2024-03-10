import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ComercioService } from '../service/comercio.service';
import { AuthService } from '../service/auth.service';
import { map } from 'rxjs/operators';

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
  promedioCalificaciones: number = 0;
  elementosMostrados = {
    tiposComercio: 5
  };

  constructor(
    private comercioService: ComercioService, private fb: FormBuilder,private authService: AuthService,
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
      (comercios) => {
        this.comercios = comercios;
        
        // Crear un array de observables para las imágenes y comentarios de cada comercio
        const observables = this.comercios.map((comercio) => {
          const establecimientoId = comercio.codEstablecimiento;
  
          // Observable para obtener imágenes
          const imagenesObservable = this.comercioService.obtenerImagenesComercio(establecimientoId);
          
          // Observable para obtener comentarios
          const comentariosObservable = this.authService.obtenerComentariosPorIdEstablecimiento(establecimientoId);
  
          // Utilizar forkJoin para combinar las solicitudes de imágenes y comentarios
          return forkJoin([imagenesObservable, comentariosObservable]).pipe(
            map(([imagenes, comentarios]) => {
              comercio.imagenesComercio = imagenes.length > 0 ? [imagenes[0]] : [];
              comercio.comentarios = comentarios;
            })
          );
        });
  
        // Utilizar forkJoin para esperar a que todas las solicitudes se completen
        forkJoin(observables).subscribe(
          () => {
            this.calcularPromedioCalificaciones(this.comercios[0]?.comentarios || []);
          },
          (error) => {
            console.error('Error al obtener imágenes y comentarios de los comercios', error);
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

  calcularPromedioCalificaciones(establecimientoId: number): number {
    const comentariosEstablecimiento = this.comercios.find(comercio => comercio.codEstablecimiento === establecimientoId)?.comentarios || [];
  
    if (comentariosEstablecimiento.length > 0) {
      const sumaCalificaciones = comentariosEstablecimiento.reduce((suma:number, comentario: any) => suma + comentario.calificacion, 0);
      const promedioCalificaciones = sumaCalificaciones / comentariosEstablecimiento.length;
      
      // Update the promedioCalificaciones property for the specific establishment
      const index = this.comercios.findIndex(comercio => comercio.codEstablecimiento === establecimientoId);
      if (index !== -1) {
        this.comercios[index].promedioCalificaciones = promedioCalificaciones;
      }
  
      return promedioCalificaciones;
    } else {
      return 0;
    }
  }
  }