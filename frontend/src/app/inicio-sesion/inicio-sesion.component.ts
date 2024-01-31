import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';  // Ajusta la ruta según tu estructura
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {

  inicioSesionForm: FormGroup;
  mensajeError: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Ajusta el nombre del servicio según tu estructura
    private router: Router,
    private cookie: CookieService, 
  ) {
    this.inicioSesionForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.inicioSesionForm.valid) {
      const credentials = {
        username: this.inicioSesionForm.value.username,
        password: this.inicioSesionForm.value.password
      };
  
      this.authService.iniciarSesion(credentials).subscribe(
        response => {
          
          // Almacenar la información en las cookies
          this.authService.guardarDatosUsuarioEnCookies(response.token, response.nombreUsuario, response.email);
          Swal.fire({
            title: "Inicio de sesión exitoso",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            this.router.navigate(['/']);
          });
        },
        error => {
  
          if (error instanceof HttpErrorResponse) {
            // Manejar el error según el tipo de error o mostrar un mensaje al usuario
            if (error.status === 401) {
              // Credenciales inválidas o usuario no encontrado
              this.mensajeError = 'Credenciales inválidas o usuario no encontrado';
             
            } else {
              // Otro tipo de error, puedes mostrar un mensaje genérico
              this.mensajeError = 'Ocurrió un error al procesar la solicitud.';
            }
          }
        }
      );
    }
  }
}