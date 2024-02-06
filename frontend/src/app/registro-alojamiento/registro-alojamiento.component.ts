import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';

@Component({
  selector: 'app-registro-alojamiento',
  templateUrl: './registro-alojamiento.component.html',
  styleUrls: ['./registro-alojamiento.component.css']
})
export class RegistroAlojamientoComponent {
  alojamientoForm: FormGroup;
  tiposAlojamiento: any[] = [];

  

  obtenerDatos(): void {
    this.alojamientoSerice.obtenerTiposAlojamiento().subscribe(
      (data) => {
        this.tiposAlojamiento = data;
        console.log(this.tiposAlojamiento)
      },
      (error) => {
        console.error('Error al obtener tipos de alojamiento', error);
        // Manejo de errores
      }
    );
  }

  ngOnInit() {
    this.obtenerDatos();
  }

  constructor(private fb: FormBuilder, private alojamientoSerice: AlojamientoService, private router: Router,) {
    this.alojamientoForm = this.fb.group({
      // Campo del establecimiento
      nombreAlojamiento:  ['', [Validators.required]],
      tipoEstablecimiento: ['Alojamento'],
      ciudad: ['Villa Carlos Paz'],
      provincia: ['Córdoba'],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      telefono: ['', Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(9),
      Validators.minLength(9)],
      metodosPago: this.fb.group({
        transferenciaBancaria: [false],
        tarjetaCredito: [false],
        tarjetaDebito: [false],
        efectivo: [false],
      }),
      web: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: ['', Validators.required], 

      // Campos del alojamiento
      categoria: ['', Validators.required],
      tipoAlojamiento: ['', Validators.required],
      servicios: this.fb.group({
        wifi: [false],
        estacionamiento: [false],
        piscina: [false],
        admiteMascotas: [false],
        accesibilidad: [false],
      }),
      
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.alojamientoForm.patchValue({
        photo: file
      });
      this.alojamientoForm.get('photo')?.updateValueAndValidity();
    }
  }
  
  updateCheckbox(controlName: string) {
    const control = this.alojamientoForm.get(controlName);
    control?.setValue(!control.value);
  }

  submitForm() {
    if (this.alojamientoForm.valid) {
      // Enviar datos al servicio de autenticación
      console.log(this.alojamientoForm.value);
    }
  }
}
