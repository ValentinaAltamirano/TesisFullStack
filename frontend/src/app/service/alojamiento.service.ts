import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {
  
  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private auth: AuthService,) {
  }

  obtenerTiposAlojamiento(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/tipoalojamientos/');
  }

  obtenerCategoria(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/categoria/');
  }

  obtenerServicios(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/tiposervicios/');
  }

  obtenerMetodosDePago(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/metodospago/');
  }


  registrarAlojamiento(data: any): Observable<any> {
    return this.http.post(this.url + 'alojamientos/alojamientos/', data);
  }

  registrarImagenes(imagenes: File[], alojamientoId: number): Observable<any> {
    const formData = new FormData();

    for (const imagen of imagenes) {
      formData.append('imagenes', imagen);
    }

    return this.http.post<any>(`${this.url}registrar-imagenes/${alojamientoId}/`, formData);
  }

  getTodosAlojamientos(): Observable<any> {
    return this.http.get(`${this.url}alojamientos/alojamientos/`);
  }

  obtenerImagenesAlojamiento(alojamientoId: number): Observable<any[]> {
    const url = `${this.url}imagenes-alojamiento/${alojamientoId}/`;
    return this.http.get<any[]>(url);
}

obtenerAlojamiento(establecimientoId: number): Observable<any> {
  const url = `${this.url}alojamientos/alojamientos/${establecimientoId}/`;
  return this.http.get(url);
}

getAlojamientoPorIdEmpresario(idEmpresario: number): Observable<any> {
  const url = `${this.url}alojamientos/alojamientos/obtenerPorIdEmpresario/?idEmpresario=${idEmpresario}`;
  return this.http.get(url);
}
    

}


