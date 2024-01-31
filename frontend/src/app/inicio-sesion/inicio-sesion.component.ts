import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';  // Ajusta la ruta según tu estructura
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {

  inicioSesionForm: FormGroup;
  mensajeError: string = '';
  tokenCookieName = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Ajusta el nombre del servicio según tu estructura
    private router: Router,
    private cookieService: CookieService, 
  ) {
    this.inicioSesionForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.inicioSesionForm.valid) {
      this.authService.login(this.inicioSesionForm.value).subscribe(
        (response: any) => {
          // Almacenar el token en el almacenamiento local o de sesión
          this.authService.setTokenInCookie(response.access);
          // Realizar acciones después del éxito
          Swal.fire({
            title: "Inicio de sesión exitoso",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            this.router.navigate(['/']).then(() => {
              location.reload();
            });
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
