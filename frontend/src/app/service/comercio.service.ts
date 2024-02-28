import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComercioService {

  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient, 
    private cookieService: CookieService,
    private router: Router,
    private auth: AuthService,) {
  }

  obtenerTiposComercio(): Observable<ComercioService[]> {
    return this.http.get<ComercioService[]>(this.url + 'comerciosCampos/tipocomercio/');
  }

  obtenerMetodosDePago(): Observable<ComercioService[]> {
    return this.http.get<ComercioService[]>(this.url + 'comerciosCampos/metodospago/');
  }

  registrarComercio(data: any): Observable<any> {
    return this.http.post(this.url + 'comercios/', data);
  }

  registrarImagenes(imagenes: File[], estbalecimientoID: number): Observable<any> {
    const formData = new FormData();

    for (const imagen of imagenes) {
      formData.append('imagenes', imagen);
    }

    return this.http.post<any>(`${this.url}imagenesComercios/${estbalecimientoID}/`, formData);
  }


  getTodosComercios(): Observable<any> {
    return this.http.get(`${this.url}comercios/`);
  }

  obtenerImagenesComercio(gastronomiaId: number): Observable<any[]> {
    const url = `${this.url}imagenesComercios/${gastronomiaId}/`;
    return this.http.get<any[]>(url);
  }

  obtenerComercio(establecimientoId: number): Observable<any> {
    const url = `${this.url}comercios/${establecimientoId}/`;
    return this.http.get(url);
  }

  getComercioPorIdEmpresario(): Observable<any> {
  
    const url = `${this.url}comercios/obtenerComercioEmpresario/`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
  
    return this.http.get(url, { headers });
  }

  eliminarEstablecimiento(idEstablecimiento: number): Observable<void> {
    const url = `${this.url}comercios/${idEstablecimiento}`; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getTokenFromCookie()}`
    });
    return this.http.delete<void>(url, { headers });
  }
  
}
