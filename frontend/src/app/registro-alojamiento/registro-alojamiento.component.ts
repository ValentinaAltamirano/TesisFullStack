import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'app-registro-alojamiento',
  templateUrl: './registro-alojamiento.component.html',
  styleUrls: ['./registro-alojamiento.component.css']
})
export class RegistroAlojamientoComponent {
  alojamientoForm: FormGroup = new FormGroup({});
  tiposAlojamiento: any[] = [];
  tiposCategoria: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  imagenes: File[] = [];
  vistasPrevias: string[] = [];

  obtenerTiposAlojamiento(): void {
    this.alojamientoSerice.obtenerTiposAlojamiento().subscribe(
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
    this.alojamientoSerice.obtenerCategoria().subscribe(
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
    this.alojamientoSerice.obtenerServicios().subscribe(
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
    this.alojamientoSerice.obtenerMetodosDePago().subscribe(
      (data) => {
        this.tiposmetodosPago = data;
        console.log(this.tiposmetodosPago)
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }

  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();
    this.initForm();
  }

  initForm(): void {
    this.alojamientoForm = this.fb.group({
      // Campos del establecimiento
      nombreAlojamiento: ['', [Validators.required]],
      tipoEstablecimiento: ['Alojamento'],
      ciudad: ['Villa Carlos Paz'],
      provincia: ['Córdoba'],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(9),
        Validators.minLength(9)
      ]],
      web: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: this.fb.array([]),

      // Campos del alojamiento
      categoria: ['', Validators.required],
      tipoAlojamiento: ['', Validators.required],
      servicioSeleccionados: this.fb.array([]),
      metodosPagoSeleccionados: this.fb.array([])
    });
  }

  constructor(
    private fb: FormBuilder,
    private alojamientoSerice: AlojamientoService,
    private router: Router,
  ) {}

  getFormControl(formPath: string): FormControl {
    const control = this.alojamientoForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }
  
  toggleCheckbox(controlName: string): void {
    const control = this.getFormControl(controlName);
  
    if (control instanceof FormControl) {
      const isChecked = control.value;
      control.setValue(!isChecked);
  
      const formArrayName = controlName.includes('servicioSeleccionados') ? 'servicioSeleccionados' : 'metodosPagoSeleccionados';
      const formArray = this.alojamientoForm.get(formArrayName) as FormArray;
  
      if (isChecked) {
        formArray.removeAt(formArray.controls.findIndex(item => item.value === controlName.split('.')[1]));
      } else {
        formArray.push(this.fb.control(controlName.split('.')[1]));
      }
  
      console.log('FormArray:', formArray.value);
    }
  
    console.log('Form value after:', this.alojamientoForm.value);
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
      const imagenesArray = this.alojamientoForm.get('imagenes') as FormArray;

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
    (this.alojamientoForm.get('imagenes') as FormArray).removeAt(index);
    this.vistasPrevias.splice(index, 1);
  }

  calculateDropzoneHeight(): number {
    const numRows = Math.ceil(this.vistasPrevias.length / 4); // Cambia 4 por el número de columnas deseado
    const itemHeight = 80; // Ajusta la altura del elemento de vista previa según sea necesario
    const minHeight = 150; // Altura mínima para el ngx-dropzone
    return Math.max(numRows * itemHeight, minHeight);
  }

  submitForm() {
    // Accede a las imágenes directamente desde el FormGroup
    const imagenes = this.alojamientoForm.get('imagenes')?.value;
    console.log('Imágenes:', imagenes);
    console.log('Form values:', this.alojamientoForm.value);
  }
}