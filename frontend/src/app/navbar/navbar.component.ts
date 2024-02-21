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
  isMenuHidden = true;

  constructor(public authService: AuthService, 
    private router: Router) {
      
    }

    ngOnInit() {
      // Verificar la autenticación al inicializar el componente
      if (this.authService.isAuthenticated()) {
        // El usuario está autenticado, realizar acciones adicionales si es necesario
        this.isAuthenticated = true;
        this.obtenerDatosUsuario()
        
      } else {
        this.isAuthenticated = false
      }
      
    }
    
    toggleMenu(): void {
      this.isMenuHidden = !this.isMenuHidden;
    }

    obtenerDatosUsuario() {
      this.authService.obtenerDatosEmpresario().subscribe(
        (userInfo: any) => {
          this.nombreUsuario = userInfo.username;
          this.email = userInfo.email;


        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }

  redirectToLogin() {
    this.router.navigate(['/']);
  }

  
  logout(): void {
    this.authService.logout();
  }
  
}
