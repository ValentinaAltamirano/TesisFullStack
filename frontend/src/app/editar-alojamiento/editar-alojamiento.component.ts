import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-editar-alojamiento',
  templateUrl: './editar-alojamiento.component.html',
  styleUrls: ['./editar-alojamiento.component.css']
})
export class EditarAlojamientoComponent {
  alojamientoForm: FormGroup = new FormGroup({});
  tiposAlojamiento: any[] = [];
  tiposCategoria: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  imagenes: File[] = [];
  imagenesOriginales: any[] = [];
  imagenesEliminadas: any[] = [];
  vistasPrevias: string[] = [];
  idEmpresario: any;
  establecimientoId: number;
  alojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  descripcion: string = '';
  nuevasImagenes: any[] = [];
  arrayServicios:any[] = [];
  arrayMetodosPago:any[] = [];
  editando = false;
  datosOriginales: any;

  constructor(
    private fb: FormBuilder,
    private alojamientoService: AlojamientoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {this.establecimientoId = 0;
  }
  
  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();
    this.obtenerIdEmpresario();
    
    this.initForm();
    this.route.params.subscribe(params => {
      
      this.establecimientoId = params['id'];
      
      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.cargarDatos()
      this.cargarImagenes();
      
    });
  }

  initForm(): void {
    this.alojamientoForm = this.fb.group({
      // Campos del establecimiento
      altura: [''],
      calle: [''],
      codCategoria: [''],
      codCiudad: [''],
      codProvincia: [''],
      codEstablecimiento: [''],
      codTipoAlojamiento: [''],
      descripcion: '',
      idEmpresario: [''],
      metodos_de_pago: this.fb.array([]),
      nombre: [''],
      servicios: this.fb.array([]),
      telefono: [''],
      imagenesEliminadas: this.fb.array([]),
      web: [''],
    });

    this.initServiciosFormArray();
    this.initMetodosPagoFormArray();
  }
  
  initServiciosFormArray(): void {
    const serviciosFormArray = this.alojamientoForm.get('servicios') as FormArray;
  
    this.tiposServicio.forEach((servicio) => {
      const isSelected = this.alojamiento && this.alojamiento.servicios.includes(servicio.codTipoServicio);
      serviciosFormArray.push(this.fb.control(isSelected));
    });
  }

  initMetodosPagoFormArray(): void {
    const metodosPagoFormArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
  
    this.tiposmetodosPago.forEach((metodoPago: { codMetodoDePago: number }) => {
      const isSelected = this.alojamiento.metodos_de_pago.includes(metodoPago.codMetodoDePago);
      metodosPagoFormArray.push(this.fb.control(isSelected));
    });
  }

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
  
        // Puedes agregar idEmpresario directamente en la inicialización del formulario
        this.alojamientoForm.get('idEmpresario')?.setValue(this.idEmpresario);
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  cargarDatos() {
    this.alojamientoService.obtenerAlojamiento(this.establecimientoId).subscribe(
      (alojamientoInfo: any) => {
        this.alojamientoForm.patchValue(alojamientoInfo);
        this.alojamiento = alojamientoInfo;  // Asigna el valor de alojamientoInfo a this.alojamiento
        this.cargarMetodosDePago(alojamientoInfo.metodos_de_pago);
        this.cargarServicios(alojamientoInfo.servicios);
        this.arrayServicios = alojamientoInfo.servicios
        this.arrayMetodosPago = alojamientoInfo.metodos_de_pago
  
        this.datosOriginales = { ...alojamientoInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }


  cargarServicios(servicios: any[]): void {
    const serviciosArray = this.alojamientoForm.get('servicios') as FormArray;
    serviciosArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    servicios.forEach(metodo => {
      serviciosArray.push(this.fb.control(metodo));
    });
  }

  cargarMetodosDePago(metodos_de_pago: any[]): void {
    const metodosDePagoArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
    metodosDePagoArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    metodos_de_pago.forEach(metodo => {
      metodosDePagoArray.push(this.fb.control(metodo));
    });
  }

  cargarImagenes() {
    this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesAlojamiento = data;
        this.imagenesOriginales = [...data]; // Almacena las imágenes originales
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }


  getMetodoPagoControl(index: number): FormControl | undefined {
    const metodosDePagoArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
    return metodosDePagoArray.at(index) as FormControl | undefined;
  }

  getServicioControl(index: number): FormControl | undefined {
    const serviciosSeleccionadosArray = this.alojamientoForm.get('servicios') as FormArray;
    const control = serviciosSeleccionadosArray.at(index) as FormControl | undefined;
    return control;
  }
  
  toggleCheckbox(index: number, item: any, formControlName: string): void {
    const formArray = this.alojamientoForm.get(formControlName) as FormArray;
  
    if (!formArray) {
      console.error(`FormArray ${formControlName} not found in the form.`);
      return;
    }
  
    // Ensure the FormArray has enough controls
    while (formArray.length <= index) {
      formArray.push(new FormControl(false)); // You can set the default value as needed
    }
  
    const control = formArray.at(index) as FormControl;
  
    if (control instanceof FormControl) {
      const isChecked = control.value;
  
      control.setValue(!isChecked);
    } else {
      console.error(`Control at index ${index} in FormArray ${formControlName} is not a FormControl.`);
    }
  }
  
  // Assuming you have a method to get the control for a specific index
  getFormControl(formControlName: string, index: number): AbstractControl | null {
    const formArray = this.alojamientoForm.get(formControlName) as FormArray;
  
    if (formArray && formArray.length > index) {
      return formArray.at(index);
    }
  
    return null;
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  eliminarImagen(index: number) {
  // Obtén el codImagen de la imagen que estás eliminando
  const codImagen = this.imagenesAlojamiento[index].codImagen;

  // Agrega el codImagen al FormArray 'imagenesEliminadas'
  const imagenesEliminadasArray = this.alojamientoForm.get('imagenesEliminadas') as FormArray;
  imagenesEliminadasArray.push(this.fb.control(codImagen));

  // Elimina la imagen del array 'imagenesAlojamiento'
  this.imagenesAlojamiento.splice(index, 1);
}

  agregarImagen(event: any) {
    const fileList: FileList = event.target.files;
  
    if (fileList.length > 0) {
      const nuevaImagen = {
        imagen: fileList[0],
        // Otras propiedades relacionadas con la imagen si es necesario
      };
  
      this.nuevasImagenes.push(nuevaImagen);
  
      
    }
  }

  getUrlFromImageObject(imagen: any): string {
    if (imagen && imagen.imagen) {
      // Crea una URL válida para la nueva imagen
      return URL.createObjectURL(imagen.imagen);
    }
    // Si no hay imagen, puedes proporcionar una URL de imagen predeterminada o manejarlo según tus necesidades
    return 'https://ruta.de.la.imagen.por.defecto/';
  }

  eliminarNuevaImagen(index: number): void {
    this.nuevasImagenes.splice(index, 1);
  }

  cancelarEdicion() {
    this.editando = false;
    // Restaurar los datos editados a los originales
    this.alojamientoForm.patchValue(this.datosOriginales);
  }

  volverMisEstablecimiento() {
    this.router.navigate(['/misEstablecimiento']).then(() => {
      location.reload();
    }); 
  }

  convertirSaltosDeLinea(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  prevenirAperturaDesplegable(event: Event): void {
    if (!this.editando) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  convertirSaltosDeLineaEnBr(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  guardarAlojamiento(): void {
    
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.alojamientoForm.get('descripcion')?.value);
    this.alojamientoForm.get('descripcion')?.setValue(descripcionConvertida);

    if (this.alojamientoForm.value) {
      const metodosDePagoSeleccionados = this.alojamientoForm.value.metodos_de_pago
      .map((valor: boolean, index: number) => valor ? this.tiposmetodosPago[index] : null)
      .filter((valor: any) => valor !== null);

    const serviciosSeleccionados = this.alojamientoForm.value.servicios
      .map((valor: boolean, index: number) => valor ? this.tiposServicio[index] : null)
      .filter((valor: any) => valor !== null);


    // Crear el objeto datosEnviar con los valores mapeados
    const datosEnviar = {
      ...this.alojamientoForm.value,
      metodos_de_pago: metodosDePagoSeleccionados,
      servicios: serviciosSeleccionados
    };

      this.alojamientoService.actualizarDatos(datosEnviar).subscribe(
        (response: any) => { 
          this.actualizarImagenes(this.establecimientoId);
        },
        (error) => {
          // Manejar el error, mostrar mensajes de error apropiados al usuario
          console.error(error);
        }
      );
    }
  }

  actualizarImagenes(alojamientoId: number) {
    // Accede a las imágenes directamente desde el FormGroup
    const formData = new FormData();
  
    // Agregar imágenes existentes al FormData
    this.imagenesOriginales.forEach(imagen => {
      formData.append('imagenes', imagen.imagen);
    });
  
    // Agregar nuevas imágenes al FormData
    const nuevasImagenes = this.nuevasImagenes.map(imagen => imagen.imagen);
    for (const nuevaImagen of nuevasImagenes) {
      formData.append('imagenes', nuevaImagen);
    }

    // Agregar imágenes eliminadas al FormData
    const imagenesEliminadasArray = this.alojamientoForm.get('imagenesEliminadas') as FormArray;

    imagenesEliminadasArray.getRawValue().forEach((codImagen: any) => {
      formData.append('imagenesEliminadas', codImagen);
    });
    
  
    // Envía las imágenes al servicio junto con el ID del alojamiento
    this.alojamientoService.actualizarImagenes(formData, alojamientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Datos actualizados correctamente!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,  // Duración en milisegundos (3 segundos en este ejemplo)
          timerProgressBar: true
        });
        
        // También puedes realizar otras acciones después de guardar correctamente
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }
  eliminarImagenesEliminadas(alojamientoId: number): void {
    const idsImagenesAEliminar: number[] = this.imagenesAlojamiento
      .filter(actual => !this.imagenesOriginales.some(original => original.id === actual.id))
      .map(imagen => imagen.id);
    
  }

}
