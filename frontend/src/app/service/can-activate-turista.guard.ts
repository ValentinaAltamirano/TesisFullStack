import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class canActivateTuristaGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar si el usuario es un turista
    const esTuristaPromise: Promise<boolean> = this.authService.canActivateTurista();
  
    // Manejar la lógica según el resultado de la promesa
    return esTuristaPromise.then(
      (esTurista: boolean) => {
        if (esTurista) {
          // Permitir el acceso
          return true;
        } else {
          // Redirigir a la página de inicio de sesión si el usuario no es turista
          this.router.navigate(['/inicioSesion']);
          return false;
        }
      },
      (error) => {
        console.error('Error al verificar si el usuario es turista:', error);
        return false;
      }
    );
  }

}
