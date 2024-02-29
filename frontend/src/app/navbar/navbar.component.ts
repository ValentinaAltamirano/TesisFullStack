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
  group: any;
  imagenPerfil: any;
  baseUrl = 'http://127.0.0.1:8000';

  constructor(public authService: AuthService, 
    private router: Router) {
      
    }

    async ngOnInit() {
      // Verificar la autenticación al inicializar el componente
      if (this.authService.isAuthenticated()) {
        this.isAuthenticated = true;
    
        if (await this.authService.canActivateEmpresario()) {
          // El usuario es empresario, realizar acciones adicionales si es necesario
          this.obtenerDatosEmpresario();
        } else if (await this.authService.canActivateTurista()) {
          // El usuario es turista, realizar acciones adicionales si es necesario
          this.obtenerDatosTurista();
        }
      } else {
        this.isAuthenticated = false;
      }
    }
    
    toggleMenu(): void {
      this.isMenuHidden = !this.isMenuHidden;
    }

    async obtenerDatosEmpresario() {
      this.authService.obtenerDatosEmpresario().subscribe(
        (userInfo: any) => {
          this.nombreUsuario = userInfo.username;
          this.email = userInfo.email;
          this.group = userInfo.groups;
        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }
    
    async obtenerDatosTurista(){
      
      this.authService.obtenerDatosTurista().subscribe(
        (userInfo: any) => {
          this.nombreUsuario = userInfo.username;
          this.email = userInfo.email;
          this.group = userInfo.groups;
          this.imagenPerfil = userInfo.imagenPefil
        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }

    esEmpresario(): boolean {
      return this.group == 'Empresario';
    }

    esTurista(): boolean {
      return this.group == 'Turista';
    }

  redirectToLogin() {
    this.router.navigate(['/']);
  }

  
  logout(): void {
    this.authService.logout();
  }
  
}
