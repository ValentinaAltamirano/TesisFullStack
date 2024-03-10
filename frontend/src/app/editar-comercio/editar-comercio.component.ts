import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ComercioService } from '../service/comercio.service';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  arrayMetodosPago:any[] = [];
  arrayTipoComercio:any[] = [];


  constructor(
    private fb: FormBuilder,
    private comercioService: ComercioService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
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

        // Cargar métodos de pago
        this.cargarMetodosDePago(comercioInfo.metodos_de_pago);
        this.arrayMetodosPago = comercioInfo.metodos_de_pago;

        const metodosPagoFormArray = this.comercioForm.get('metodos_de_pago') as FormArray;
          this.tiposmetodosPago.forEach((nombre: string) => {
              const metrodoDePagoSeleccionado = comercioInfo.metodos_de_pago.find((s: any) => s.nombre === nombre);
              const isSelected = !!metrodoDePagoSeleccionado;
              metodosPagoFormArray.push(this.fb.control(isSelected));
          });

          const tiposComercioFormArray = this.comercioForm.get('codTipoComercio') as FormArray;
          this.tiposComercio.forEach((nombre: string) => {
              const tipoComercioSeleccionado = comercioInfo.codTipoComercio.find((s: any) => s.nombre === nombre);
              const isSelected = !!tipoComercioSeleccionado; // true si se encuentra, false si no se encuentra
              tiposComercioFormArray.push(this.fb.control(isSelected));
          });
          
        this.datosOriginales = { ...comercioInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }

  cargarMetodosDePago(metodosPago: any) {
    this.arrayMetodosPago = metodosPago;
  }

  cargarTiposComercio(tiposGastronomia: any) {
    this.arrayTipoComercio = tiposGastronomia;
  }

  getMetodoPagoControl(index: number): FormControl | undefined {
    const metodosDePagoArray = this.comercioForm.get('metodos_de_pago') as FormArray;
    return metodosDePagoArray.at(index) as FormControl | undefined;
  }

  getTipoComercioControl(index: number): FormControl | undefined {
    const tiposComercioArray = this.comercioForm.get('codTipoComercio') as FormArray;
    return tiposComercioArray.at(index) as FormControl | undefined;
  }

  toggleCheckbox(index: number, item: any, formControlName: string): void {
    const formArray = this.comercioForm.get(formControlName) as FormArray;
  
    if (!formArray) {
      console.error(`FormArray ${formControlName} not found in the form.`);
      return;
    }
  
    // Buscar el ítem específico en el FormArray
    const control = formArray.controls[index] as FormControl;
  
    if (control) {
      const isChecked = control.value;
      console.log('isChecked', isChecked);
  
      // Cambiar el valor del control usando el valor del ítem
      control.setValue(!isChecked);
      console.log('index', index);
      console.log('formControlName', formControlName);
      console.log('item', item);
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

  isMetodoDePagoSeleccionado(metodoPago: any): boolean {
    return this.arrayMetodosPago.some((s: any) => s.nombre == metodoPago);
  }

  isTipoComercioSeleccionado(tipoComercio: any): boolean {
    return this.arrayTipoComercio.some((s: any) => s.nombre == tipoComercio);
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
  
    // Verifica si el FormArray 'imagenesEliminadas' existe
    if (!this.comercioForm.get('imagenesEliminadas')) {
      // Si no existe, inicialízalo como un FormArray vacío
      this.comercioForm.setControl('imagenesEliminadas', this.fb.array([]));
    }
  
    // Agrega el codImagen al FormArray 'imagenesEliminadas'
    const imagenesEliminadasArray = this.comercioForm.get('imagenesEliminadas') as FormArray;
    imagenesEliminadasArray.push(this.fb.control(codImagen));
  
    // Elimina la imagen del array 'imagenesGastronomia'
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

  getUrlFromImageObject(imagen: any): SafeUrl {
    if (imagen && imagen.imagen) {
      // Sanitize the URL to avoid the ExpressionChangedAfterItHasBeenCheckedError
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imagen.imagen));
    }
    // If no image, you can provide a default safe URL or handle it based on your needs
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

  convertirSaltosDeLineaEnBr(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  getSelectedData(formControlName: string, sourceArray: any[]): any[] {
    const formArray = this.comercioForm.get(formControlName) as FormArray;
  
    if (!formArray) {
      console.error(`FormArray ${formControlName} not found in the form.`);
      return [];
    }
  
    return formArray.controls
      .map((control: AbstractControl, index: number) => control.value ? sourceArray[index] : null)
      .filter((value: any) => value !== null);
  }

  guardarComercio(): void {
    
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.comercioForm.get('descripcion')?.value);
    this.comercioForm.get('descripcion')?.setValue(descripcionConvertida);

    const metodosDePagoSeleccionados = this.getSelectedData('metodos_de_pago', this.tiposmetodosPago);
    const tiposComercioSeleccionados = this.getSelectedData('codTipoComercio', this.tiposComercio);

    
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

  actualizarImagenes(establecimientoId: number) {
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

    this.comercioService.actualizarImagenes(formData, establecimientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Datos actualizados correctamente!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000, 
          timerProgressBar: true
        }).then(() => {
          // location.reload();
        });
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }
  
  eliminarImagenesEliminadas(alojamientoId: number): void {
    const imagenesEliminadasArray = this.comercioForm.get('imagenesEliminadas') as FormArray;
  
    if (imagenesEliminadasArray) {
      const idsImagenesAEliminar: number[] = imagenesEliminadasArray.getRawValue()
        .filter((codImagen: any) => codImagen !== null)
        .map((codImagen: any) => codImagen);
  
      // Now you can use idsImagenesAEliminar as needed
    } else {
      console.error('FormArray imagenesEliminadas not found in the form.');
    }
  }
}
