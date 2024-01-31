import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  {
  nombreUsuario: any ;
  userData: any = {};

  constructor(private authService: AuthService, 
    private router: Router) {}
  
    ngOnInit(): void {
      this.nombreUsuario = this.authService.obtenerNombreUsuarioDesdeCookie();
      this.datosUsuario(this.nombreUsuario);
      
    }
  
  datosUsuario(username: string): void {
    this.authService.obtenerDatosUsuario()
    .subscribe(
      datosUsuario => {
        console.log(datosUsuario);
        // Maneja los datos del usuario como desees
      },
      error => {
        console.error(error);
      }
    );
  }

}