import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientosCampos/tipoalojamientos/');
  }

  obtenerCategoria(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientosCampos/categoria/');
  }

  obtenerServicios(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientosCampos/tiposervicios/');
  }

  obtenerMetodosDePago(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientosCampos/metodospago/');
  }


  registrarAlojamiento(data: any): Observable<any> {
    return this.http.post(this.url + 'alojamientos/', data);
  }

  registrarImagenes(imagenes: File[], alojamientoId: number): Observable<any> {
    const formData = new FormData();

    for (const imagen of imagenes) {
      formData.append('imagenes', imagen);
    }

    return this.http.post<any>(`${this.url}imagenesAlojamiento/${alojamientoId}/`, formData);
  }

  getTodosAlojamientos(): Observable<any> {
    return this.http.get(`${this.url}alojamientos/`);
  }

  obtenerImagenesAlojamiento(alojamientoId: number): Observable<any[]> {
    const url = `${this.url}imagenesAlojamiento/${alojamientoId}/`;
    return this.http.get<any[]>(url);
}

obtenerAlojamiento(establecimientoId: number): Observable<any> {
  const url = `${this.url}alojamientos/${establecimientoId}/`;
  return this.http.get(url);
}

getAlojamientoPorIdEmpresario(): Observable<any> {
  
  const url = `${this.url}alojamientos/obtenerAlojamientosEmpresario/`;
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
  });

  return this.http.get(url, { headers });
}

eliminarEstablecimiento(idEstablecimiento: number): Observable<void> {
  const url = `${this.url}alojamientos/${idEstablecimiento}`; 
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
  });
  return this.http.delete<void>(url, { headers });
}
    

}


