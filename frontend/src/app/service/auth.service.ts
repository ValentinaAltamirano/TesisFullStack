import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {  map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private url: string = 'http://127.0.0.1:8000/api/'
  tokenCookieName = 'access_token';
  groupEmpresario: any;
  groupTurista: any;
  
  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router) {
  }

  registrarEmpresario(data: any): Observable<any> {
    return this.http.post(this.url + 'empresarios/', data);
  }

  registrarTurista(data: any): Observable<any> {
    return this.http.post(this.url + 'turistas/', data);
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

  obtenerGrupos() {
    this.obtenerDatosEmpresario().subscribe(
      (userInfoEmpresario: any) => {
        
        this.groupEmpresario = userInfoEmpresario.groups;
      }
    );
  
    
  }

  // Función para verificar si el usuario es un empresario
  async canActivateEmpresario(): Promise<boolean> {
    try {
      const zoneAwarePromise: any = await this.obtenerDatosEmpresario().toPromise();
  
      // Verifica la estructura del objeto resuelto
      const userInfoEmpresario: any = zoneAwarePromise;
  
      // Verifica que userInfoTurista.groups sea un array
      if (Array.isArray(userInfoEmpresario.groups) && userInfoEmpresario.groups.includes('Empresario') && this.isAuthenticated()){
        return true;
      } else {
        return false;
      }
      
    } catch (error) {
      console.error('Error al obtener datos del Empresario:', error);
      return false;
    }
  }

  // Función para verificar si el usuario es un turista
  async canActivateTurista(): Promise<boolean> {
    try {
      const zoneAwarePromise: any = await this.obtenerDatosTurista().toPromise();
  
      // Verifica la estructura del objeto resuelto
      const userInfoTurista: any = zoneAwarePromise;
  
      // Verifica que userInfoTurista.groups sea un array
      if (Array.isArray(userInfoTurista.groups) && userInfoTurista.groups.includes('Turista') && this.isAuthenticated()){
        return true;
      } else {
        return false;
      }
      
    } catch (error) {
      console.error('Error al obtener datos del turista:', error);
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
    const userInfoUrl = `${this.url}empresarios/obtenerDatos`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });
  
    return this.http.get(userInfoUrl, { headers });
  }

  actualizarDatosEmpresario(datos: any): Observable<any> {
    const url = `${this.url}empresarios/actualizarDatos/`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });

    return this.http.put(url, datos, { headers });
  }

  cambiarContrasenaEmpresario(data: any): Observable<any> {
    const url = `${this.url}empresarios/cambiarContrasena/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
  });  
    return this.http.put(url, data, { headers });
  }

  obtenerDatosTurista(): Observable<any> {
    const userInfoUrl = `${this.url}turistas/obtenerDatos`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });
  
    return this.http.get(userInfoUrl, { headers });
  }

  obtenerUnTurista(turistaId: number): Observable<any> {
    const userInfoUrl = `${this.url}turistas/obtenerDatos/${turistaId}`;
    return this.http.get(userInfoUrl);
  }

  actualizarDatosTurista(datos: any): Observable<any> {
    const url = `${this.url}turistas/actualizarDatos/`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });

    return this.http.put(url, datos, { headers });
  }

  cambiarContrasenaTurista(data: any): Observable<any> {
    const url = `${this.url}turistas/cambiarContrasena/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
  });  
    return this.http.put(url, data, { headers });
  }
 
  obtenerIconoPerfil(): Observable<any> {
    const iconoPerfil = `${this.url}imagenesPerfil/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });
  
    return this.http.get(iconoPerfil, { headers });
  }

  registrarComentario(data: any): Observable<any> {
    const url = `${this.url}comentarios/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });
    
    // Pasa los encabezados como parte de las opciones, no como parte del cuerpo
    const options = { headers: headers };
  
    return this.http.post<void>(url, data, options);
  }

  obtenerComentariosPorIdEstablecimiento(establecimientoId: number): Observable<any> {
    const url = `${this.url}comentarios/comentariosEstablecimiento/?establecimiento_id=${establecimientoId}`;
    return this.http.get(url);
  }

  obtenerComentarios(): Observable<any> {
    const url = `${this.url}comentarios/`;
    return this.http.get(url);
  }

  editarComentario(datos: any, comentarioId: number): Observable<any> {
    const url = `${this.url}comentarios/${comentarioId}/`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });

    return this.http.put(url, datos, { headers });
  }

  eliminarComentario(idComentario: number): Observable<void> {
    const url = `${this.url}comentarios/${idComentario}`; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getTokenFromCookie()}`
    });
    return this.http.delete<void>(url, { headers });
  }
     

}
