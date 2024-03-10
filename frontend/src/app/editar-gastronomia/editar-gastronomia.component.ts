import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GastronomiaService } from '../service/gastronomia.service';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editar-gastronomia',
  templateUrl: './editar-gastronomia.component.html',
  styleUrls: ['./editar-gastronomia.component.css']
})
export class EditarGastronomiaComponent {
  gastronomiaForm: FormGroup = new FormGroup({});
  tiposGastronomia: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  tipoComida: any[] = [];
  preferenciaAlimentaria: any[] = [];
  imagenes: File[] = [];
  vistasPrevias: string[] = [];
  idEmpresario: any;
  establecimientoId: number;
  gastronomia: any;
  imagenesGastronomia: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  descripcion: string = '';
  arrayTipoGastronomia:any[] = [];
  arrayTipoPreferencia:any[] = [];
  arrayTiposComida:any[] = [];
  arrayServicios:any[] = [];
  arrayMetodosPago:any[] = [];
  nuevasImagenes: any[] = [];
  imagenesOriginales: any[] = [];
  submitted = false;

  editando = false;
  datosOriginales: any;

  constructor(
    private fb: FormBuilder,
    private gastronomiaService: GastronomiaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {this.establecimientoId = 0;
  }
  
  ngOnInit() {
    this.obtenerTiposGastronomia();
    this.obtenerServicioGastronomia();
    this.obtenerTipoComida();
    this.obtenerPreferenciaAlimentaria();
    this.obtenerMetodosDePago(); 
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
    this.gastronomiaForm = this.fb.group({
      // Campos del establecimiento
      altura: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(50)]],
      calle: ['', [Validators.required, Validators.maxLength(50)]],
      codEstablecimiento: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      idEmpresario: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9'.,_\-&()!@#$%^*+=<>?/\|[\]{}:;`~" \p{L}]+$/u), Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+]+$/), Validators.minLength(10), Validators.maxLength(20)]],
      web: ['', [Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)]],

      // Campos del gastronomia
      tipos_servicio_gastronomico: this.fb.array([], [Validators.required]),
      tipos_gastronomia: this.fb.array([], [Validators.required]),
      metodos_de_pago: this.fb.array([], [Validators.required]),
      tipos_comida: this.fb.array([], [Validators.required]),
      tipos_pref_alimentaria: this.fb.array([], [Validators.required]),
      imagenesEliminadas: this.fb.array([]),
    });
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

  obtenerIdEmpresario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.idEmpresario = userInfo.id;
        // Puedes agregar idEmpresario directamente en la inicialización del formulario
        this.gastronomiaForm.get('idEmpresario')?.setValue(this.idEmpresario);
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  cargarDatos() {
    this.gastronomiaService.obtenerGastronomia(this.establecimientoId).subscribe(
      (gastronomiaInfo: any) => {
        this.gastronomiaForm.patchValue(gastronomiaInfo);
  
        // Check if gastronomiaInfo is not undefined before accessing its properties
        if (gastronomiaInfo) {
          this.cargarMetodosDePago(gastronomiaInfo.metodos_de_pago);
          this.arrayMetodosPago = gastronomiaInfo.metodos_de_pago;

          this.cargarServicios(gastronomiaInfo.tipos_servicio_gastronomico);
          this.arrayServicios = gastronomiaInfo.tipos_servicio_gastronomico;

          this.cargarTiposGastronomia(gastronomiaInfo.tipos_gastronomia);
          this.arrayTipoGastronomia = gastronomiaInfo.tipos_gastronomia;

          this.cargarTiposComida(gastronomiaInfo.tipos_comida);
          this.arrayTiposComida = gastronomiaInfo.tipos_comida;

          this.cargarTiposPrefAlimentaria(gastronomiaInfo.tipos_pref_alimentaria);
          this.arrayTipoPreferencia = gastronomiaInfo.tipos_pref_alimentaria;

          // Initialize the metodos_de_pago FormArray with the obtained data
          const metodosPagoFormArray = this.gastronomiaForm.get('metodos_de_pago') as FormArray;
          this.tiposmetodosPago.forEach((nombre: string) => {
              const metrodoDePagoSeleccionado = gastronomiaInfo.metodos_de_pago.find((s: any) => s.nombre === nombre);
              const isSelected = !!metrodoDePagoSeleccionado;
              metodosPagoFormArray.push(this.fb.control(isSelected));
          });

          // Initialize the tipos_servicio_gastronomico FormArray with the obtained data
          const tiposServicioFormArray = this.gastronomiaForm.get('tipos_servicio_gastronomico') as FormArray;
          this.tiposServicio.forEach((nombreServicio: string) => {
              const servicioSeleccionado = gastronomiaInfo.tipos_servicio_gastronomico.find((s: any) => s.nombre === nombreServicio);
              const isSelected = !!servicioSeleccionado; // true si se encuentra, false si no se encuentra
              tiposServicioFormArray.push(this.fb.control(isSelected));
          });
          
          console.log(this.tiposServicio)
          console.log(gastronomiaInfo.tipos_servicio_gastronomico)

          // Initialize the tipos_gastronomia FormArray with the obtained data
          const tiposGastronomiaFormArray = this.gastronomiaForm.get('tipos_gastronomia') as FormArray;
          
          this.tiposGastronomia.forEach((nombre: string) => {
              const tipoGastronomiaSeleccionado = gastronomiaInfo.tipos_gastronomia.find((s: any) => s.nombre === nombre);
              const isSelected = !!tipoGastronomiaSeleccionado;
              tiposGastronomiaFormArray.push(this.fb.control(isSelected));
          });

          // Initialize the tipos_comida FormArray with the obtained data
          const tiposComidaFormArray = this.gastronomiaForm.get('tipos_comida') as FormArray;
          this.tipoComida.forEach((nombre: string) => {
              const tipoComidaSeleccionado = gastronomiaInfo.tipos_comida.find((s: any) => s.nombre === nombre);
              const isSelected = !!tipoComidaSeleccionado;
              tiposComidaFormArray.push(this.fb.control(isSelected));
          });

          // Initialize the tipos_pref_alimentaria FormArray with the obtained data
          const tiposPrefAlimentariaFormArray = this.gastronomiaForm.get('tipos_pref_alimentaria') as FormArray;
          console.log()
          this.preferenciaAlimentaria.forEach((nombre: string) => {
              const preferenciaAlimentariaSeleccionada = gastronomiaInfo.tipos_pref_alimentaria.find((s: any) => s.nombre === nombre);
              const isSelected = !!preferenciaAlimentariaSeleccionada;
              tiposPrefAlimentariaFormArray.push(this.fb.control(isSelected));
          });
  
          console.log(gastronomiaInfo);
          this.datosOriginales = { ...gastronomiaInfo };
        } else {
          console.error('GastronomiaInfo is undefined or null.');
        }
      },
      error => {
        console.error('Error al obtener la información de gastronomía', error);
      }
    );
  }

  cargarMetodosDePago(metodosPago: any) {
  this.arrayMetodosPago = metodosPago;
}

cargarServicios(servicios: any) {
  this.arrayServicios = servicios;
  
}

cargarTiposGastronomia(tiposGastronomia: any) {
  this.arrayTipoGastronomia = tiposGastronomia;
}

cargarTiposComida(tiposComida: any) {
  this.arrayTiposComida = tiposComida;
}

cargarTiposPrefAlimentaria(tiposPrefAlimentaria: any) {
  this.arrayTipoPreferencia = tiposPrefAlimentaria;
}

  getFormControl(formControlName: string, index: number): AbstractControl | null {
    const formArray = this.gastronomiaForm.get(formControlName) as FormArray;
  
    if (formArray && formArray.length > index) {
      return formArray.at(index);
    }
  
    return null;
  }


  getMetodoPagoControl(index: number): FormControl | undefined {
    const metodosDePagoArray = this.gastronomiaForm.get('metodos_de_pago') as FormArray;
    return metodosDePagoArray.at(index) as FormControl | undefined;
  }

  getTipoGastronomiaControl(index: number): FormControl | undefined {
    const tiposGastronomiaArray = this.gastronomiaForm.get('tipos_gastronomia') as FormArray;
    return tiposGastronomiaArray.at(index) as FormControl | undefined;
  }

  getServicioControl(index: number): FormControl | undefined {
    const serviciosSeleccionadosArray = this.gastronomiaForm.get('tipos_servicio_gastronomico') as FormArray;
    return serviciosSeleccionadosArray.at(index) as FormControl | undefined;
  }

  getTipoPrefAlimentariaControl(index: number): FormControl | undefined {
    const tiposPrefAlimentariaArray = this.gastronomiaForm.get('tipos_pref_alimentaria') as FormArray;
    return tiposPrefAlimentariaArray.at(index) as FormControl | undefined;
  }

  getTipoComidaControl(index: number): FormControl | undefined {
    const tiposComidaArray = this.gastronomiaForm.get('tipos_comida') as FormArray;
    return tiposComidaArray.at(index) as FormControl | undefined;
  }

  
  toggleCheckbox(index: number, item: any, formControlName: string): void {
    const formArray = this.gastronomiaForm.get(formControlName) as FormArray;
  
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

  isMetodoDePagoSeleccionado(metodoPago: any): boolean {
    return this.arrayMetodosPago.some((s: any) => s.nombre == metodoPago);
  }

  isTipoServicioSeleccionado(tipoServicio: any): boolean {
  return this.arrayServicios.some((s: any) => s.nombre == tipoServicio);
  }

  isTipoGastronomiaSeleccionado(tipoGastronomia: any): boolean {
    return this.arrayTipoGastronomia.some((g: any) => g.nombre == tipoGastronomia);
  }
  
  isTipoComidaSeleccionado(tipoComida: any): boolean {
    return this.arrayTiposComida.some((c: any) => c.nombre == tipoComida);
  }

  isPrefAlimentariaSeleccionada(prefAlimentaria: any): boolean {
    return this.arrayTipoPreferencia.some((p: any) => p.nombre == prefAlimentaria);
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  cargarImagenes() {
    this.gastronomiaService.obtenerImagenesGastronomia(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesGastronomia = data;
        this.imagenesOriginales = [...data];
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  eliminarImagen(index: number) {
    // Obtén el codImagen de la imagen que estás eliminando
    const codImagen = this.imagenesGastronomia[index].codImagen;
  
    // Verifica si el FormArray 'imagenesEliminadas' existe
    if (!this.gastronomiaForm.get('imagenesEliminadas')) {
      // Si no existe, inicialízalo como un FormArray vacío
      this.gastronomiaForm.setControl('imagenesEliminadas', this.fb.array([]));
    }
  
    // Agrega el codImagen al FormArray 'imagenesEliminadas'
    const imagenesEliminadasArray = this.gastronomiaForm.get('imagenesEliminadas') as FormArray;
    imagenesEliminadasArray.push(this.fb.control(codImagen));
  
    // Elimina la imagen del array 'imagenesGastronomia'
    this.imagenesGastronomia.splice(index, 1);
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
    this.gastronomiaForm.patchValue(this.datosOriginales);
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

  getSelectedData(formControlName: string, sourceArray: any[]): any[] {
    const formArray = this.gastronomiaForm.get(formControlName) as FormArray;
  
    if (!formArray) {
      console.error(`FormArray ${formControlName} not found in the form.`);
      return [];
    }
  
    return formArray.controls
      .map((control: AbstractControl, index: number) => control.value ? sourceArray[index] : null)
      .filter((value: any) => value !== null);
  }

  guardarGastronomia(): void {
    
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.gastronomiaForm.get('descripcion')?.value);
    this.gastronomiaForm.get('descripcion')?.setValue(descripcionConvertida);

    if (this.gastronomiaForm.value) {

      // Obtener métodos de pago seleccionados
      const metodosDePagoSeleccionados = this.getSelectedData('metodos_de_pago', this.tiposmetodosPago);
    
      // Obtener servicios gastronómicos seleccionados
      const serviciosGastronomicosSeleccionados = this.gastronomiaForm.value.tipos_servicio_gastronomico
        .map((valor: boolean, index: number) => valor ? this.tiposServicio[index] : null)
        .filter((valor: any) => valor !== null);
    
      // Obtener tipos de gastronomía seleccionados
      const tiposGastronomiaSeleccionados = this.gastronomiaForm.value.tipos_gastronomia
        .map((valor: boolean, index: number) => valor ? this.tiposGastronomia[index] : null)
        .filter((valor: any) => valor !== null);
    
      // Obtener tipos de comida seleccionados
      const tiposComidaSeleccionados = this.gastronomiaForm.value.tipos_comida
        .map((valor: boolean, index: number) => valor ? this.tipoComida[index] : null)
        .filter((valor: any) => valor !== null);
    
      // Obtener tipos de preferencia alimentaria seleccionados
      const tiposPrefAlimentariaSeleccionados = this.gastronomiaForm.value.tipos_pref_alimentaria
        .map((valor: boolean, index: number) => valor ? this.preferenciaAlimentaria[index] : null)
        .filter((valor: any) => valor !== null);
    
      // Crear el objeto datosEnviar con los valores mapeados
      const datosEnviar = {
        ...this.gastronomiaForm.value,
        metodos_de_pago: metodosDePagoSeleccionados,
        tipos_servicio_gastronomico: serviciosGastronomicosSeleccionados,
        tipos_gastronomia: tiposGastronomiaSeleccionados,
        tipos_comida: tiposComidaSeleccionados,
        tipos_pref_alimentaria: tiposPrefAlimentariaSeleccionados
      };

      

      if (this.gastronomiaForm.valid) {
          this.gastronomiaService.actualizarDatos(datosEnviar).subscribe(
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
    const imagenesEliminadasArray = this.gastronomiaForm.get('imagenesEliminadas') as FormArray;

    imagenesEliminadasArray.getRawValue().forEach((codImagen: any) => {
      formData.append('imagenesEliminadas', codImagen);
    });

    this.gastronomiaService.actualizarImagenes(formData, alojamientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Datos actualizados correctamente!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000, 
          timerProgressBar: true
        }).then(() => {
          location.reload();
        });
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }
  
  eliminarImagenesEliminadas(alojamientoId: number): void {
    const imagenesEliminadasArray = this.gastronomiaForm.get('imagenesEliminadas') as FormArray;
  
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
