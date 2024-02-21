import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { GastronomiaService } from '../service/gastronomia.service';


@Component({
  selector: 'app-registro-gastronomia',
  templateUrl: './registro-gastronomia.component.html',
  styleUrls: ['./registro-gastronomia.component.css']
})
export class RegistroGastronomiaComponent {
  gastronomiaForm: FormGroup = new FormGroup({});
  tiposGastronomia: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  tipoComida: any[] = [];
  preferenciaAlimentaria: any[] = [];
  imagenes: File[] = [];
  vistasPrevias: string[] = [];
  idEmpresario: any;

  constructor(
    private fb: FormBuilder,
    private gastronomiaService: GastronomiaService,
    private router: Router,
    private authService: AuthService,
  ) {}

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
        this.tiposServicio = data;
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
        this.tipoComida = data;
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
        this.tiposmetodosPago = data;
      },
      (error) => {
        console.error('Error al obtener métodos de pago', error);
        // Manejo de errores
      }
    );
  }

  ngOnInit() {
    this.obtenerTiposGastronomia();
    this.obtenerServicioGastronomia();
    this.obtenerTipoComida();
    this.obtenerPreferenciaAlimentaria();
    this.obtenerMetodosDePago(); 
    this.initForm();
  }
  
  initForm(): void {
    this.gastronomiaForm = this.fb.group({
      // Campos del establecimiento
      nombre: ['', [Validators.required]],
      tipoEstablecimiento: [2],
      codCiudad: [1],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      telefono: ['', [Validators.required,]],
      web: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: this.fb.array([]),
      horaApertura: [''],
      horaCierre: [''],

      // Campos del gastronomia
      tiposGastronomiaSeleccionados: this.fb.array([]),
      servicioSeleccionados: this.fb.array([]),
      metodosPagoSeleccionados: this.fb.array([]),
      tipoComidaSeleccionados: this.fb.array([]),
      preferenciaAlimentariaSeleccionadas: this.fb.array([]),
    });
  }

  getFormControl(formPath: string): FormControl {
    const control = this.gastronomiaForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }
  
  toggleCheckbox(controlName: string): void {
    const control = this.getFormControl(controlName);
  
    if (control instanceof FormControl) {
      const isChecked = control.value;
      control.setValue(!isChecked);
  
      const formArrayName = controlName.split('.')[0];
      const formArray = this.gastronomiaForm.get(formArrayName) as FormArray;
  
      if (isChecked) {
        formArray.removeAt(formArray.controls.findIndex(item => item.value === controlName.split('.')[1]));
      } else {
        formArray.push(this.fb.control(controlName.split('.')[1]));
      }
    }
  }

  onFileChange(event: any): void {
    const archivos = event.target.files;

    // Puedes procesar cada archivo como necesites
    for (const archivo of archivos) {
      // Aquí puedes realizar acciones como cargar las imágenes a un servidor, etc.
      console.log('Nombre del archivo:', archivo.name);
      console.log('Tamaño del archivo:', archivo.size);
    }
  }

  dropzoneConfig: any = {
    // Customize your dropzone configuration here
    // For example:
    maxFiles: 10,
    acceptedFiles: 'image/*',
  };

  agregarImagen(event: NgxDropzoneChangeEvent) {
    const files = event.addedFiles;
    if (files.length > 0) {
      const imagenesArray = this.gastronomiaForm.get('imagenes') as FormArray;

      for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          imagenesArray.push(this.fb.control(file));
          this.vistasPrevias.push(e.target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  eliminarImagen(index: number) {
    (this.gastronomiaForm.get('imagenes') as FormArray).removeAt(index);
    this.vistasPrevias.splice(index, 1);
  }

  calculateDropzoneHeight(): number {
    const numRows = Math.ceil(this.vistasPrevias.length / 4); // Cambia 4 por el número de columnas deseado
    const itemHeight = 80; // Ajusta la altura del elemento de vista previa según sea necesario
    const minHeight = 150; // Altura mínima para el ngx-dropzone
    return Math.max(numRows * itemHeight, minHeight);
  }

  submitForm() {
    console.log(this.gastronomiaForm.value)
    
  }

  registrarImagenes(gastronomiaId: number) {
    
  }
}
