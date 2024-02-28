import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ComercioService } from '../service/comercio.service';

@Component({
  selector: 'app-registro-comercio',
  templateUrl: './registro-comercio.component.html',
  styleUrls: ['./registro-comercio.component.css']
})
export class RegistroComercioComponent {
  comercioForm: FormGroup = new FormGroup({});
  tiposComercios: any[] = [];
  tiposmetodosPago: any[] = [];
  imagenes: File[] = [];
  vistasPrevias: string[] = [];
  idEmpresario: any;

  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private router: Router,
    private authService: AuthService,
  ) {}

  obtenerTiposComercio(): void {
    this.comercioService.obtenerTiposComercio().subscribe(
      (data) => {
        this.tiposComercios = data;
      },
      (error) => {
        console.error('Error al obtener tipos de Gastronomía', error);
        // Manejo de errores
      }
    );
  }

  obtenerMetodosDePago(): void {
    this.comercioService.obtenerMetodosDePago().subscribe(
      (data) => {
        this.tiposmetodosPago = data;
      },
      (error) => {
        console.error('Error al obtener métodos de pago', error);
        // Manejo de errores
      }
    );
  }

  obtenerIdEmpresario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.idEmpresario = userInfo.id;
        // Puedes agregar idEmpresario directamente en la inicialización del formulario
        this.comercioForm.get('idEmpresario')?.setValue(this.idEmpresario);
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  ngOnInit() {
    this.obtenerTiposComercio();
    this.obtenerMetodosDePago(); 
    this.obtenerIdEmpresario();
    this.initForm();
  }

  initForm(): void {
    this.comercioForm = this.fb.group({
      // Campos del establecimiento
      idEmpresario: [''],
      nombre: ['', [Validators.required]],
      tipoEstablecimiento: [2],
      codCiudad: [1],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      telefono: ['', ],
      web: ['', ],
      descripcion: ['', Validators.required],
      imagenes: this.fb.array([]),
      metodosPagoSeleccionados: this.fb.array([]),

      // Campos del comercio
      tipoComerciosSeleccionados: this.fb.array([]),
    });
  }

  getFormControl(formPath: string): FormControl {
    const control = this.comercioForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }
  
  toggleCheckbox(controlName: string): void {
    const control = this.getFormControl(controlName);

    if (control instanceof FormControl) {
        const isChecked = control.value;
        control.setValue(!isChecked);

        const formArrayName = controlName.split('.')[0];
        const formArray = this.comercioForm.get(formArrayName) as FormArray;

        if (isChecked) {
            // Elimina el valor del FormArray
            const indexToRemove = formArray.controls.findIndex(item => item.value.toString() === controlName.split('.')[1]);
            if (indexToRemove !== -1) {
                formArray.removeAt(indexToRemove);
            }
        } else {
            // Agrega el valor al FormArray
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
      const imagenesArray = this.comercioForm.get('imagenes') as FormArray;

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
    (this.comercioForm.get('imagenes') as FormArray).removeAt(index);
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
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.comercioForm.get('descripcion')?.value);
    this.comercioForm.get('descripcion')?.setValue(descripcionConvertida);
    

    if (this.comercioForm.valid) {
      // Enviar datos al servicio de autenticación
      this.comercioService.registrarComercio(this.comercioForm.value).subscribe(
        (response: any) => {
          const establecimientoId = response.establecimientoId; // Suponiendo que el servicio devuelve el ID del establecimiento
  
          // Registrar las imágenes asociadas al establecimiento
          this.registrarImagenes(establecimientoId);
        },
        (error) => {
          // Manejar el error, mostrar mensajes de error apropiados al usuario
          console.error(error);
        }
      );
    }
  }

  registrarImagenes(establecimientoId: number) {
    // Accede a las imágenes directamente desde el FormGroup
    const imagenes = this.comercioForm.get('imagenes')?.value;
  
    // Envía las imágenes al servicio junto con el ID del establecimiento
    this.comercioService.registrarImagenes(imagenes, establecimientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Registro de comercio exitoso",
          icon: "success",
          confirmButtonText: "OK"
        }).then((result) => {
          this.router.navigate(['/']);
        });
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }
}
