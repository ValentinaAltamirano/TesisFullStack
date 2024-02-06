import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {
  
  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router) {
  }

  obtenerTiposAlojamiento(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/tipoalojamientos/');
  }

  obtenerCategoria(): Observable<AlojamientoService[]> {
    return this.http.get<AlojamientoService[]>(this.url + 'alojamientos/categoria/');
  }


}
