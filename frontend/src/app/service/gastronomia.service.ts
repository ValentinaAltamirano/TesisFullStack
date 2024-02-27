import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GastronomiaService {

  private url: string = 'http://127.0.0.1:8000/api/'


  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private auth: AuthService,) {
  }

  obtenerTiposGastronomia(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'gastronomiasCampos/tipogastronomia/');
  }

  obtenerServicioGastronomia(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'gastronomiasCampos/serviciosGastronomia/');
  }

  obtenerTipoComida(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'gastronomiasCampos/tipocomida/');
  }

  obtenerPreferenciaAlimentaria(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'gastronomiasCampos/preferenciaAlimentaria/');
  }

  obtenerMetodosDePago(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'gastronomiasCampos/metodospago/');
  }

  registrarGastronomia(data: any): Observable<any> {
    return this.http.post(this.url + 'gastronomias/', data);
  }

  registrarImagenes(imagenes: File[], estbalecimientoID: number): Observable<any> {
    const formData = new FormData();

    for (const imagen of imagenes) {
      formData.append('imagenes', imagen);
    }

    return this.http.post<any>(`${this.url}imagenesGastronomia/${estbalecimientoID}/`, formData);
  }

  getTodosGastronomia(): Observable<any> {
    return this.http.get(`${this.url}gastronomias/`);
  }

  obtenerImagenesGastronomia(gastronomiaId: number): Observable<any[]> {
    const url = `${this.url}imagenesGastronomia/${gastronomiaId}/`;
    return this.http.get<any[]>(url);
  }

  obtenerGastronomia(establecimientoId: number): Observable<any> {
    const url = `${this.url}gastronomias/${establecimientoId}/`;
    return this.http.get(url);
  }

  getGastronomiaPorIdEmpresario(): Observable<any> {
  
    const url = `${this.url}gastronomias/obtenerGastronomiaEmpresario/`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
  
    return this.http.get(url, { headers });
  }

  eliminarEstablecimiento(idEstablecimiento: number): Observable<void> {
    const url = `${this.url}gastronomias/${idEstablecimiento}`; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
    return this.http.delete<void>(url, { headers });
  }
}
