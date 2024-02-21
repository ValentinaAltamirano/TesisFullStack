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
    return this.http.get<GastronomiaService[]>(this.url + 'tipogastronomia/');
  }

  obtenerServicioGastronomia(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'serviciosGastronomia/');
  }

  obtenerTipoComida(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'tipocomida/');
  }

  obtenerPreferenciaAlimentaria(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'preferenciaAlimentaria/');
  }

  obtenerMetodosDePago(): Observable<GastronomiaService[]> {
    return this.http.get<GastronomiaService[]>(this.url + 'metodospago/');
  }

  registrarGastronomia(data: any): Observable<any> {
    return this.http.post(this.url + 'gastronomias/', data);
  }

  registrarImagenes(imagenes: File[], gastronomiaId: number): Observable<any> {
    const formData = new FormData();

    for (const imagen of imagenes) {
      formData.append('imagenes', imagen);
    }

    return this.http.post<any>(`${this.url}registrar-imagenes/${gastronomiaId}/`, formData);
  }

  getTodosGastronomia(): Observable<any> {
    return this.http.get(`${this.url}gastronomias/`);
  }

  obtenerImagenesGastronomia(gastronomiaId: number): Observable<any[]> {
    const url = `${this.url}imagenes-gastronomia/${gastronomiaId}/`;
    return this.http.get<any[]>(url);
  }

  obtenerGastronomia(establecimientoId: number): Observable<any> {
    const url = `${this.url}alojamientos/${establecimientoId}/`;
    return this.http.get(url);
  }
}
