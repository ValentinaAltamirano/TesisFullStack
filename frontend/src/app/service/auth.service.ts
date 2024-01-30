import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router) {
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

  // Método para realizar el logout
  logout(): void {
    // Eliminar el token de sesión 
    this.cookieService.delete('token');

    // Redirigir al usuario a la página de inicio o a donde desees después del logout
    this.router.navigate(['/']);
  }

}
