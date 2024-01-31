import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';  // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-registro-empresario',
  templateUrl: './registro-empresario.component.html',
  styleUrls: ['./registro-empresario.component.css']
})

export class RegistroEmpresarioComponent {

  empresarioForm: FormGroup = new FormGroup({});
  usuarioId: number = 0;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.empresarioForm = this.fb.group({
      // Campos del usuario
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],

      // Campos del Empresario
      razonSocial: ['', Validators.required],
      descripcion: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.empresarioForm.valid) {
      // Enviar datos al servicio de autenticación
      this.authService.registrarEmpresario(this.empresarioForm.value).subscribe(
        (response: any) => {
          Swal.fire({
            title: "Inicio de sesión exitoso",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            this.router.navigate(['/inicioSesion']);
          });
        },
        (error) => {
          console.error(error);
          // Manejar errores
        }
      );
    }
  }

  ngOnInit(): void {}
}