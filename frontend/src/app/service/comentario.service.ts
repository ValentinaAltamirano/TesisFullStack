import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class comentarioService {

  private url: string = environment.apiUrl;

  constructor(private http: HttpClient, 
    private auth: AuthService) { }

  private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
      });
  }

  /**
 * Registra un nuevo comentario.
 * @param data - Los datos del comentario a registrar.
 * @returns Un Observable que emite la respuesta del servidor después de registrar el comentario.
 */
  registrarComentario(data: any): Observable<any> {
    const url = `${this.url}comentarios/`;
    const headers = this.getHeaders();
    
    // Pasa los encabezados como parte de las opciones, no como parte del cuerpo
    const options = { headers: headers };
  
    return this.http.post<void>(url, data, options);
  }

  /**
 * Obtiene los comentarios asociados a un establecimiento específico.
 * @param establecimientoId - El ID del establecimiento del cual se obtendrán los comentarios.
 * @returns Un Observable que emite los comentarios asociados al establecimiento especificado.
 */
  obtenerComentariosPorIdEstablecimiento(establecimientoId: number): Observable<any> {
    const url = `${this.url}comentarios/comentariosEstablecimiento/?establecimiento_id=${establecimientoId}`;
    return this.http.get(url);
  }

  /**
 * Obtiene todos los comentarios registrados.
 * @returns Un Observable que emite todos los comentarios registrados.
 */
  obtenerComentarios(): Observable<any> {
    const url = `${this.url}comentarios/`;
    return this.http.get(url);
  }

  /**
 * Edita un comentario existente.
 * @param datos - Los nuevos datos para actualizar el comentario.
 * @param comentarioId - El ID del comentario que se va a editar.
 * @returns Un Observable que emite la respuesta del servidor después de editar el comentario.
 */
  editarComentario(datos: any, comentarioId: number): Observable<any> {
    const url = `${this.url}comentarios/${comentarioId}/`;
    const headers = this.getHeaders();

    return this.http.put(url, datos, { headers });
  }

  /**
 * Elimina un comentario existente.
 * @param idComentario - El ID del comentario que se va a eliminar.
 * @returns Un Observable que emite la respuesta del servidor después de eliminar el comentario.
 */
  eliminarComentario(idComentario: number): Observable<void> {
    const url = `${this.url}comentarios/${idComentario}`; 
    const headers = this.getHeaders();
    return this.http.delete<void>(url, { headers });
  }
}
