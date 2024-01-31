import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  {
<<<<<<< Updated upstream
  apellido: any;
  nombre: any;
  email: any;
  telefono: any;
  username: any;
  razonSocial: any;
=======
  datosEmpresario: any;
>>>>>>> Stashed changes

  constructor(private authService: AuthService, 
    private router: Router) {}
  
    ngOnInit() {
<<<<<<< Updated upstream
      this.obtenerDatosUsuario()
    }

    obtenerDatosUsuario() {
      this.authService.obtenerDatosEmpresario().subscribe(
        (userInfo: any) => {
          console.log('Información del usuario:', userInfo);
          this.apellido = userInfo.apellido;
          this.nombre = userInfo.nombre;
          this.email = userInfo.email;
          this.telefono = userInfo.telefono;
          this.username = userInfo.username;
          this.razonSocial = userInfo.razonSocial;


        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }
  }

=======
      const token = this.authService.getTokenFromCookie(); // Asume que tienes una función getToken en tu servicio de autenticación
  
      if (token) {
        this.authService.obtenerDatosEmpresario(token).subscribe(
          (response: any) => {
            this.datosEmpresario = response;
            console.log(this.datosEmpresario)
          },
          (error) => {
            console.error(error);
            // Manejar errores
          }
        );
      }
    }
  }
>>>>>>> Stashed changes
