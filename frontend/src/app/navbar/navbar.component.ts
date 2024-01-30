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
 
  

  constructor(public authService: AuthService, 
    private router: Router) {
    }

    
    ngOnInit() {
      // Verificar la autenticación al inicializar el componente
      if (this.authService.estaAutenticado()) {
        // El usuario está autenticado, realizar acciones adicionales si es necesario
        this.isAuthenticated = true;
        console.log('Esta autenticado')
      } else {
        this.isAuthenticated = false
        console.log('No esta autenticado')
      }
    }

    
  redirectToLogin() {
    this.router.navigate(['/']);
  }

  
  logout(): void {
    // Llama al método de logout en el servicio de autenticación
    this.authService.logout();
  }
  
}
