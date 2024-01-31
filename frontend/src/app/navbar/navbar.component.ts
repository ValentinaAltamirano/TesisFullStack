import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuthenticated: boolean = false;
  nombreUsuario: any ;
  email: any;

  constructor(public authService: AuthService, 
    private router: Router) {
      
    }

    ngOnInit() {
      // Verificar la autenticación al inicializar el componente
      if (this.authService.isAuthenticated()) {
        // El usuario está autenticado, realizar acciones adicionales si es necesario
        this.isAuthenticated = true;
<<<<<<< Updated upstream
        this.obtenerDatosUsuario()
        
=======
        console.log('Esta autenticado')
>>>>>>> Stashed changes
      } else {
        this.isAuthenticated = false
      }
      
    }
  

<<<<<<< Updated upstream
    obtenerDatosUsuario() {
      this.authService.obtenerDatosEmpresario().subscribe(
        (userInfo: any) => {
          console.log('Información del usuario:', userInfo);
          this.nombreUsuario = userInfo.username;
          this.email = userInfo.email;


        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }
=======
  actualizarNombreUsuarioEmail(): void {
  }  
>>>>>>> Stashed changes

  redirectToLogin() {
    this.router.navigate(['/']);
  }

  
  logout(): void {
    this.authService.logout();
  }
  
}
