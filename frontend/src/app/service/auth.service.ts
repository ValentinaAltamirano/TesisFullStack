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
  tokenCookieName = 'access_token';

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router) {
  }

  registrarEmpresario(data: any): Observable<any> {
    return this.http.post(this.url + 'crear_empresario/', data);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.url}token/`, credentials);
  }

  setTokenInCookie(token: string): void {
    this.cookieService.set(this.tokenCookieName, token);
  }

  getTokenFromCookie(): string | undefined {
    return this.cookieService.get(this.tokenCookieName);
  }

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;  // Permitir el acceso si el usuario está autenticado
    } else {
      // Redirigir a la página de inicio de sesión si el usuario no está autenticado
      this.router.navigate(['/inicioSesion']);
      return false;
    }
  }

  isAuthenticated(): boolean {
  // Verifica si el token existe y no ha expirado
  const token = this.getTokenFromCookie();
  return token !== undefined && token !== null && token.length > 0;
}

  logout(): void {
    this.cookieService.delete(this.tokenCookieName);
    this.router.navigate(['/']);
  }

  obtenerDatosEmpresario(): Observable<any> {
    const userInfoUrl = `${this.url}obtener_datos_empresario/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });

    console.log(userInfoUrl, { headers, withCredentials: true, 'Authorization': `Bearer ${this.getTokenFromCookie()}` });
  
    return this.http.get(userInfoUrl, { headers });
  }


}
