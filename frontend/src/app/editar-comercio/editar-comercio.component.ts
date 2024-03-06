import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ComercioService } from '../service/comercio.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-editar-comercio',
  templateUrl: './editar-comercio.component.html',
  styleUrls: ['./editar-comercio.component.css']
})
export class EditarComercioComponent {
  comercioForm: FormGroup = new FormGroup({});
  tiposComercio: any[] = [];
  tiposmetodosPago: any[] = [];
  idEmpresario: any;
  establecimientoId: number;
  comercios: any;
  imagenesComercio: any[] = [];
  imagenesOriginales: any[] = [];
  imagenesEliminadas: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  editando = false;
  datosOriginales: any;
  nuevasImagenes: any[] = [];


  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {this.establecimientoId = 0;
  }

  ngOnInit() {
    this.obtenerTiposComercio();
    this.obtenerMetodosDePago(); 
    this.initForm();
    this.route.params.subscribe(params => {
      
      this.establecimientoId = params['id'];
      
      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.cargarDatos()
      this.cargarImagenes();
      
    });
  }

  initForm(): void {
    this.comercioForm = this.fb.group({
      // Campos del establecimiento
      altura: ['', Validators.required],
      calle: ['', Validators.required],
      codCategoria: ['', Validators.required],
      codCiudad: ['', Validators.required],
      codProvincia: ['', Validators.required],
      codEstablecimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      idEmpresario: [''],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      web: ['', Validators.required],
      metodos_de_pago: this.fb.array([]),
      imagenesEliminadas: this.fb.array([]),

      // Campos del gastronomia
      codTipoComercio: this.fb.array([]),
    });

    this.initTipoComercioFormArray();
    this.initMetodosPagoFormArray();
  }

  initTipoComercioFormArray(): void {
    const tipoComercioFormArray = this.comercioForm.get('codTipoComercio') as FormArray;
  
    this.tiposComercio.forEach((tipoComercio) => {
      const isSelected = this.comercios && this.comercios.codTipoComercio.includes(tipoComercio.codTipoServicio);
      tipoComercioFormArray.push(this.fb.control(isSelected));
    });
  }

  initMetodosPagoFormArray(): void {
    const metodosPagoFormArray = this.comercioForm.get('metodos_de_pago') as FormArray;
  
    this.tiposmetodosPago.forEach((metodoPago: { codMetodoDePago: number }) => {
      const isSelected = this.comercios.metodos_de_pago.includes(metodoPago.codMetodoDePago);
      metodosPagoFormArray.push(this.fb.control(isSelected));
    });
  }

  obtenerTiposComercio(): void {
    this.comercioService.obtenerTiposComercio().subscribe(
      (data) => {
        this.tiposComercio = data;
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

  cargarDatos() {
    this.comercioService.obtenerComercio(this.establecimientoId).subscribe(
      (comercioInfo: any) => {
        this.comercioForm.patchValue(comercioInfo);
        this.cargarMetodosDePago(comercioInfo.metodos_de_pago);
        this.cargarTiposComercio(comercioInfo.codTipoComercio);
        
        console.log(comercioInfo)
        this.datosOriginales = { ...comercioInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }

  cargarMetodosDePago(metodos_de_pago: any[]): void {
    const metodosDePagoArray = this.comercioForm.get('metodos_de_pago') as FormArray;
    metodosDePagoArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    metodos_de_pago.forEach(metodo => {
      metodosDePagoArray.push(this.fb.control(metodo));
    });
  }

  cargarTiposComercio(comercioSeleccionados: any[]): void {
    const comercioSeleccionadosArray = this.comercioForm.get('codTipoComercio') as FormArray;
    comercioSeleccionadosArray.clear();
    
    comercioSeleccionados.forEach(codTipoComercio => {
      comercioSeleccionadosArray.push(this.fb.control(codTipoComercio));
    });
  }

  getMetodoPagoControl(index: number): FormControl | undefined {
    const metodosDePagoArray = this.comercioForm.get('metodos_de_pago') as FormArray;
    return metodosDePagoArray.at(index) as FormControl | undefined;
  }

  getTiposComercio(index: number): FormControl | undefined {
    const comercioSeleccionadosArray = this.comercioForm.get('codTipoComercio') as FormArray;
    return comercioSeleccionadosArray.at(index) as FormControl | undefined;
  }

  toggleCheckbox(index: number, item: any, formControlName: string): void {
    const formArray = this.comercioForm.get(formControlName) as FormArray;
  
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

  getFormControl(formControlName: string, index: number): AbstractControl | null {
    const formArray = this.comercioForm.get(formControlName) as FormArray;
  
    if (formArray && formArray.length > index) {
      return formArray.at(index);
    }
  
    return null;
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  cargarImagenes() {
    this.comercioService.obtenerImagenesComercio(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesComercio = data;
        this.imagenesOriginales = [...data];
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  eliminarImagen(index: number) {
    // Obtén el codImagen de la imagen que estás eliminando
    const codImagen = this.imagenesComercio[index].codImagen;
  
    // Agrega el codImagen al FormArray 'imagenesEliminadas'
    const imagenesEliminadasArray = this.comercioForm.get('imagenesEliminadas') as FormArray;
    imagenesEliminadasArray.push(this.fb.control(codImagen));
  
    // Elimina la imagen del array 'imagenesAlojamiento'
    this.imagenesComercio.splice(index, 1);
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
    this.comercioForm.patchValue(this.datosOriginales);
  }

  volverMisEstablecimiento() {
    this.router.navigate(['/misEstablecimiento']).then(() => {
      location.reload();
    }); 
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

  guardarComercio(): void {
    
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.comercioForm.get('descripcion')?.value);
    this.comercioForm.get('descripcion')?.setValue(descripcionConvertida);

    if (this.comercioForm.value) {
      console.log(this.comercioForm.value.metodos_de_pago)
      const metodosDePagoSeleccionados = this.comercioForm.value.metodos_de_pago
      .map((valor: boolean, index: number) => valor ? this.tiposmetodosPago[index] : null)
      .filter((valor: any) => valor !== null);

      
      console.log(this.comercioForm.value.codTipoComercio)
      const tiposComercioSeleccionados = this.comercioForm.value.codTipoComercio
      .map((valor: boolean, index: number) => valor ? this.tiposComercio[index] : null)
      .filter((valor: any) => valor !== null);


    // Crear el objeto datosEnviar con los valores mapeados
    const datosEnviar = {
      ...this.comercioForm.value,
      metodos_de_pago: metodosDePagoSeleccionados,
      codTipoComercio: tiposComercioSeleccionados
    };

      this.comercioService.actualizarDatos(datosEnviar).subscribe(
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
    const imagenesEliminadasArray = this.comercioForm.get('imagenesEliminadas') as FormArray;

    imagenesEliminadasArray.getRawValue().forEach((codImagen: any) => {
      formData.append('imagenesEliminadas', codImagen);
    });
    
  
    // Envía las imágenes al servicio junto con el ID del alojamiento
    this.comercioService.actualizarImagenes(formData, alojamientoId).subscribe(
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
    const idsImagenesAEliminar: number[] = this.imagenesComercio
      .filter(actual => !this.imagenesOriginales.some(original => original.id === actual.id))
      .map(imagen => imagen.id);
  }
}
