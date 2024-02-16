import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { ActivatedRoute } from '@angular/router';

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
  vistasPrevias: string[] = [];
  idEmpresario: any;
  establecimientoId: number;
  alojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';

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
      codHorario: [''],
      codTipoAlojamiento: [''],
      descripcion: [''],
      idEmpresario: [''],
      metodos_de_pago: this.fb.array([]),
      nombre: [''],
      servicios: this.fb.array([]),
      telefono: [''],
      tipoEstablecimiento: [''],
      web: [''],
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
        this.cargarMetodosDePago(alojamientoInfo.metodos_de_pago);
        this.cargarServicios(alojamientoInfo.servicios);
        console.log(this.alojamientoForm);
  
        this.datosOriginales = { ...alojamientoInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }

  cargarMetodosDePago(metodos_de_pago: any[]): void {
    const metodosDePagoArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
    metodosDePagoArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    metodos_de_pago.forEach(metodo => {
      metodosDePagoArray.push(this.fb.control(metodo));
    });
  }

  cargarServicios(serviciosSeleccionados: any[]): void {
    const serviciosSeleccionadosArray = this.alojamientoForm.get('servicios') as FormArray;
    serviciosSeleccionadosArray.clear();
    
    serviciosSeleccionados.forEach(servicio => {
      serviciosSeleccionadosArray.push(this.fb.control(servicio));
    });
  }

  cargarImagenes() {
    this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesAlojamiento = data;
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  getFormControl(formPath: string): FormControl {
    const control = this.alojamientoForm.get(formPath) as FormControl;
    return control || new FormControl(null);
  }

  getMetodoPagoControl(index: number): FormControl | undefined {
    const metodosDePagoArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
    return metodosDePagoArray.at(index) as FormControl | undefined;
  }

  getServicioControl(index: number): FormControl | undefined {
    const serviciosSeleccionadosArray = this.alojamientoForm.get('servicios') as FormArray;
    return serviciosSeleccionadosArray.at(index) as FormControl | undefined;
  }
  
  toggleCheckbox(controlPath: string): void {
    const [formArrayName, indexStr] = controlPath.split('.');
    const index = parseInt(indexStr, 10);
  
    const formArray = this.alojamientoForm.get(formArrayName) as FormArray;
    const control = formArray.at(index) as FormControl;
  
    if (control instanceof FormControl) {
      const isChecked = control.value;
      control.setValue(!isChecked);
    }
  }

  toggleEdicion() {
    this.editando = !this.editando;
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

  prevenirAperturaDesplegable(event: Event): void {
    if (!this.editando) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
