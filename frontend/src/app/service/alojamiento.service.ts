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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
    return this.http.post(this.url + 'alojamientos/alojamientos/', data, { headers });
  }
    

  }


