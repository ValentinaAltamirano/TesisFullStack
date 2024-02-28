import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GastronomiaService } from '../service/gastronomia.service';
import { ComercioService } from '../service/comercio.service';

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
  baseUrl = 'http://127.0.0.1:8000';
  editando = false;
  datosOriginales: any;


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

  toggleCheckbox(controlPath: string): void {
    const [formArrayName, indexStr] = controlPath.split('.');
    const index = parseInt(indexStr, 10);
  
    const formArray = this.comercioForm.get(formArrayName) as FormArray;
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
    this.comercioService.obtenerImagenesComercio(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesComercio = data;
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  eliminarImagen(index: number) {
    // Lógica para eliminar la imagen del array
    this.imagenesComercio.splice(index, 1);
  }

  agregarImagen(event: any) {
    const fileList: FileList = event.target.files;
    
    if (fileList.length > 0) {
      const nuevaImagen = {
        imagen: fileList[0], // Guarda la referencia al archivo (puedes necesitar procesarla antes de almacenarla)
        // Otras propiedades relacionadas con la imagen si es necesario
      };
  
      this.imagenesComercio.push(nuevaImagen);
    }
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
}
