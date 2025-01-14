import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
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
  idEmpresario: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private alojamientoService: AlojamientoService,
    private router: Router,
    private authService: AuthService,
  ) {}


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

  obtenerIdEmpresario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.idEmpresario = userInfo.id;
        console.log(this.idEmpresario)
        
  
        // Puedes agregar idEmpresario directamente en la inicialización del formulario
        this.alojamientoForm.get('idEmpresario')?.setValue(this.idEmpresario);
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }
  
  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();
    this.obtenerIdEmpresario(); 
    this.initForm();
  }

  

  initForm(): void {
    this.alojamientoForm = this.fb.group({
      // Campos del establecimiento
      idEmpresario: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9'.,_\-&()!@#$%^*+=<>?/\|[\]{}:;`~" \p{L}]+$/u), Validators.maxLength(50)]],
      tipoEstablecimiento: [1],
      codCiudad: [1],
      calle: ['', [Validators.required, Validators.maxLength(50)]],
      altura: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+]+$/), Validators.minLength(10), Validators.maxLength(20)]],
      web: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      imagenes: this.fb.array([], [Validators.required]),
      // Campos del alojamiento
      categoria: ['', [Validators.required]],
      tipoAlojamiento: [null, [Validators.required]],
      servicioSeleccionados: this.fb.array([], [Validators.required]),
      metodosPagoSeleccionados: this.fb.array([], [Validators.required]),
    });
  }


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
      console.log(formArrayName)
      const formArray = this.alojamientoForm.get(formArrayName) as FormArray;
      console.log(formArray)
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

  convertirSaltosDeLineaEnBr(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  submitForm() {
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.alojamientoForm.get('descripcion')?.value);
    this.alojamientoForm.get('descripcion')?.setValue(descripcionConvertida);
    this.submitted = true;
    if (this.alojamientoForm.valid) {
      // Enviar datos al servicio de autenticación
      this.alojamientoService.registrarAlojamiento(this.alojamientoForm.value).subscribe(
        (response: any) => {
          const alojamientoId = response.alojamientoId; // Suponiendo que el servicio devuelve el ID del alojamiento
  
          // Registrar las imágenes asociadas al alojamiento
          this.registrarImagenes(alojamientoId);
        },
        (error) => {
          // Manejar el error, mostrar mensajes de error apropiados al usuario
          console.error(error);
        }
      );
    }
  }

  registrarImagenes(alojamientoId: number) {
    // Accede a las imágenes directamente desde el FormGroup
    const imagenes = this.alojamientoForm.get('imagenes')?.value;
  
    // Envía las imágenes al servicio junto con el ID del alojamiento
    this.alojamientoService.registrarImagenes(imagenes, alojamientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Registro de alojamiento exitoso",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,  // Duración en milisegundos (3 segundos en este ejemplo)
          timerProgressBar: true
        }).then((result) => {
          this.router.navigate(['/']).then(() => {
            location.reload();
          });
        });
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }

}