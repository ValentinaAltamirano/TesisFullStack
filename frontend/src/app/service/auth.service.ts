import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpresarioModel } from '../interfaces/Empresario'
import { UsuarioModel } from '../interfaces/Usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private url: string = 'http://127.0.0.1:8000/api/'

  constructor(private http: HttpClient) {
  }

  // agregar nuevo usuario
  registrarUsuario(datosUsuario: any): Observable<any> {
    const url = `${this.url}empresario/registrarUsuario/`;
    return this.http.post(url, { usuario: datosUsuario });
  }

  // Función para registrar un empresario relacionado con un usuario
  registrarEmpresarioUsuario(idUsuario: number, datosEmpresario: any): Observable<any> {
    const url = `${this.url}empresario/usuario/${idUsuario}/`;
    return this.http.post(url, { empresario: datosEmpresario });
  }

  iniciarSesion(credentials: any): Observable<any> {
    const url = `${this.url}inicioSesion/`; 
    return this.http.post(url, credentials);
  }

}
