import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private url: string = environment.apiUrl;
  
  constructor(private http: HttpClient, 
    private auth: AuthService) {
    
   }

   private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
  }

  /**
   * Registra un nuevo empresario.
   * @param datos - Los datos del empresario a registrar.
   * @returns Un Observable que emite la respuesta del servidor.
   */
  registrarEmpresario(data: any): Observable<any> {
    return this.http.post(this.url + 'empresarios/', data);
  }

  /**
 * Obtiene los datos del Empresario actual.
 * @returns Un Observable que emite los datos del Empresario actual.
 */
  obtenerDatosEmpresario(): Observable<any> {
    const userInfoUrl = `${this.url}empresarios/obtenerDatos`;
    const headers = this.getHeaders();
  
    return this.http.get(userInfoUrl, { headers });
  }

  /**
 * Actualiza los datos del Empresario actual.
 * @param datos - Los nuevos datos del Empresario.
 * @returns Un Observable que emite la respuesta del servidor después de la actualización.
 */
  actualizarDatosEmpresario(datos: any): Observable<any> {
    const url = `${this.url}empresarios/actualizarDatos/`;
    const headers = this.getHeaders();

    return this.http.put(url, datos, { headers });
  }

  /**
 * Cambia la contraseña del Empresario actual.
 * @param data - La información necesaria para cambiar la contraseña.
 * @returns Un Observable que emite la respuesta del servidor después de cambiar la contraseña.
 */
  cambiarContrasenaEmpresario(data: any): Observable<any> {
    const url = `${this.url}empresarios/cambiarContrasena/`;
    const headers = this.getHeaders(); 
    return this.http.put(url, data, { headers });
  }

  /**
   * Registra un nuevo turista.
   * @param datos - Los datos del turista a registrar.
   * @returns Un Observable que emite la respuesta del servidor.
   */
  registrarTurista(data: any): Observable<any> {
    return this.http.post(this.url + 'turistas/', data);
  }

  /**
 * Obtiene los datos del Turista actual.
 * @returns Un Observable que emite los datos del Turista actual.
 */
  obtenerDatosTurista(): Observable<any> {
    const userInfoUrl = `${this.url}turistas/obtenerDatos`;
    const headers = this.getHeaders();
  
    return this.http.get(userInfoUrl, { headers });
  }

  /**
 * Obtiene los datos de un Turista específico.
 * @param turistaId - El ID del Turista a obtener.
 * @returns Un Observable que emite los datos del Turista específico.
 */
  obtenerUnTurista(turistaId: number): Observable<any> {
    const userInfoUrl = `${this.url}turistas/obtenerDatos/${turistaId}`;
    return this.http.get(userInfoUrl);
  }

   /**
 * Actualiza los datos del Turista actual.
 * @param datos - Los nuevos datos del Turista.
 * @returns Un Observable que emite la respuesta del servidor después de la actualización.
 */
   actualizarDatosTurista(datos: any): Observable<any> {
    const url = `${this.url}turistas/actualizarDatos/`;
    const headers = this.getHeaders();

    return this.http.put(url, datos, { headers });
  }

  /**
 * Cambia la contraseña del Turista actual.
 * @param data - La información necesaria para cambiar la contraseña.
 * @returns Un Observable que emite la respuesta del servidor después de cambiar la contraseña.
 */
  cambiarContrasenaTurista(data: any): Observable<any> {
    const url = `${this.url}turistas/cambiarContrasena/`;
    const headers = this.getHeaders();
    return this.http.put(url, data, { headers });
  }
  
  /**
 * Obtiene el icono de perfil del Turista actual.
 * @returns Un Observable que emite el icono de perfil del Turista actual.
 */
  obtenerIconoPerfil(): Observable<any> {
    const iconoPerfil = `${this.url}imagenesPerfil/`;
    const headers = this.getHeaders();
  
    return this.http.get(iconoPerfil, { headers });
  }
}

