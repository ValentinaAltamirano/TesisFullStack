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

  ngOnInit(): void {
  }

  constructor(public authService: AuthService, 
    private router: Router) {
      // this.isAuthenticated = this.authService.getAuthenticationStatus();
      this.isAuthenticated = false;
    }

    
    

    
  redirectToLogin() {
    this.router.navigate(['/']);
  }

  
  logout(): void {
    // Eliminar el token al cerrar sesión
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    // Obten la ruta actual
    window.location.reload()
    this.router.navigate(['/']);
  }
  
}
