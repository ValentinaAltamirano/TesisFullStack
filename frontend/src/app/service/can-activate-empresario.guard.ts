import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateEmpresario implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar si el usuario es un turista
    const esEmpresarioPromise: Promise<boolean> = this.authService.canActivateEmpresario();
  
    // Manejar la lógica según el resultado de la promesa
    return esEmpresarioPromise.then(
      (esEmpresario: boolean) => {
        if (esEmpresario) {
          // Permitir el acceso
          return true;
        } else {
          // Redirigir a la página de inicio de sesión si el usuario no es turista
          this.router.navigate(['/inicioSesion']);
          return false;
        }
      },
      (error) => {
        console.error('Error al verificar si el usuario es empresario:', error);
        return false;
      }
    );
  }

}