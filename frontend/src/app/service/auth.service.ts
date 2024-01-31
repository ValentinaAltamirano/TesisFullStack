import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router) {
  }

  canActivate(): boolean {
    if (this.estaAutenticado()) {
      return true;  // Permitir el acceso si el usuario está autenticado
    } else {
      // Redirigir a la página de inicio de sesión si el usuario no está autenticado
      this.router.navigate(['/inicioSesion']);
      return false;
    }
  }

  // agregar nuevo usuario
  registrarUsuario(datosUsuario: any): Observable<any> {
    const url = `${this.url}empresario/registrarUsuario/`;
    return this.http.post(url, { usuario: datosUsuario });
  }

  // Función para registrar un empresario relacionado con un usuario
  registrarEmpresarioUsuario(idUsuario: number, datosEmpresario: any): Observable<any> {
    const url = `${this.url}empresario/usuario/${idUsuario}/`;
    return this.http.post(url, { empresario: datosEmpresario });
  }

  iniciarSesion(credentials: any): Observable<any> {
    const url = `${this.url}inicioSesion/`; 
    return this.http.post(url, credentials);
  }

  // Verificar si el usuario está autenticado
  estaAutenticado(): boolean {
    const token = this.cookieService.get('token');
    return !!token;  // Devuelve true si el token existe, de lo contrario, false
  }

  guardarDatosUsuarioEnCookies(token: string, nombreUsuario: string, email: string): void {
    this.cookieService.set('token', token);
    this.cookieService.set('nombreUsuario', nombreUsuario);
    this.cookieService.set('email', email);
  }

  obtenerNombreUsuarioDesdeCookie(): string {
    return this.cookieService.get('nombreUsuario');
  }

  obtenerEmailDesdeCookie(): string {
    return this.cookieService.get('email');
  }

  obtenerDatosUsuario(): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.url}empresarioDatos/`;
    return this.http.get(`${url}`, { headers });
  }

  // Método para realizar el logout
  logout(): void {
    // Eliminar el token de sesión 
    this.cookieService.delete('token');

    // Redirigir al usuario a la página de inicio o a donde desees después del logout
    this.router.navigate(['/']);
  }

  

}
