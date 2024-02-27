import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { ActivatedRoute } from '@angular/router';
import { GastronomiaService } from '../service/gastronomia.service';

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

  editando = false;
  datosOriginales: any;

  constructor(
    private fb: FormBuilder,
    private gastronomiaService: GastronomiaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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

      // Campos del gastronomia
      tipos_servicio_gastronomico: this.fb.array([]),
      tipos_gastronomia: this.fb.array([]),
      metodos_de_pago: this.fb.array([]),
      tipos_comida: this.fb.array([]),
      tipos_pref_alimentaria: this.fb.array([]),
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
        this.cargarMetodosDePago(gastronomiaInfo.metodos_de_pago);
        this.cargarServicios(gastronomiaInfo.tipos_servicio_gastronomico);
        this.cargarTiposGastronomia(gastronomiaInfo.tipos_gastronomia);
        this.cargarTiposComida(gastronomiaInfo.tipos_comida);
        this.cargarTiposPrefAlimentaria(gastronomiaInfo.tipos_pref_alimentaria);
        
        console.log(gastronomiaInfo)
        this.datosOriginales = { ...gastronomiaInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }

  cargarMetodosDePago(metodos_de_pago: any[]): void {
    const metodosDePagoArray = this.gastronomiaForm.get('metodos_de_pago') as FormArray;
    metodosDePagoArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    metodos_de_pago.forEach(metodo => {
      metodosDePagoArray.push(this.fb.control(metodo));
    });
  }

  cargarServicios(serviciosSeleccionados: any[]): void {
    const serviciosSeleccionadosArray = this.gastronomiaForm.get('tipos_servicio_gastronomico') as FormArray;
    serviciosSeleccionadosArray.clear();
    
    serviciosSeleccionados.forEach(tipos_servicio_gastronomico => {
      serviciosSeleccionadosArray.push(this.fb.control(tipos_servicio_gastronomico));
    });
  }

  cargarTiposGastronomia(tipos_gastronomia: any[]): void {
    const tiposGastronomiaArray = this.gastronomiaForm.get('tipos_gastronomia') as FormArray;
    tiposGastronomiaArray.clear();
  
    tipos_gastronomia.forEach(tipo => {
      tiposGastronomiaArray.push(this.fb.control(tipo));
    });
  }
  
  cargarTiposComida(tipos_comida: any[]): void {
    const tiposComidaArray = this.gastronomiaForm.get('tipos_comida') as FormArray;
    tiposComidaArray.clear();
  
    tipos_comida.forEach(tipo => {
      tiposComidaArray.push(this.fb.control(tipo));
    });
  }
  
  cargarTiposPrefAlimentaria(tipos_pref_alimentaria: any[]): void {
    const tiposPrefAlimentariaArray = this.gastronomiaForm.get('tipos_pref_alimentaria') as FormArray;
    tiposPrefAlimentariaArray.clear();
  
    tipos_pref_alimentaria.forEach(tipo => {
      tiposPrefAlimentariaArray.push(this.fb.control(tipo));
    });
  }

  getFormControl(formPath: string): FormControl {
    const control = this.gastronomiaForm.get(formPath) as FormControl;
    return control || new FormControl(null);
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

  
  toggleCheckbox(controlPath: string): void {
    const [formArrayName, indexStr] = controlPath.split('.');
    const index = parseInt(indexStr, 10);
  
    const formArray = this.gastronomiaForm.get(formArrayName) as FormArray;
    const control = formArray.at(index) as FormControl;
  
    if (control instanceof FormControl) {
      const isChecked = control.value;
      control.setValue(!isChecked);
    }
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  cargarImagenes() {
    this.gastronomiaService.obtenerImagenesGastronomia(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesGastronomia = data;
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  eliminarImagen(index: number) {
    // Lógica para eliminar la imagen del array
    this.imagenesGastronomia.splice(index, 1);
  }

  agregarImagen(event: any) {
    const fileList: FileList = event.target.files;
    
    if (fileList.length > 0) {
      const nuevaImagen = {
        imagen: fileList[0], // Guarda la referencia al archivo (puedes necesitar procesarla antes de almacenarla)
        // Otras propiedades relacionadas con la imagen si es necesario
      };
  
      this.imagenesGastronomia.push(nuevaImagen);
    }
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
}
