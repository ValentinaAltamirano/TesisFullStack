import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';  // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators,  } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-registro-empresario',
  templateUrl: './registro-empresario.component.html',
  styleUrls: ['./registro-empresario.component.css']
})

export class RegistroEmpresarioComponent {

  empresarioForm: FormGroup = new FormGroup({});
  usuarioId: number = 0;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private empresarioService: AuthService,
    private route: ActivatedRoute) {
        const usuarioIdParam = this.route.snapshot.paramMap.get('usuarioId');
        this.usuarioId = usuarioIdParam ? +usuarioIdParam : 0;
}

  ngOnInit(): void {
    this.empresarioForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
      razonSocial: ['', Validators.required],
      descripcion: ['', Validators.required],
      telefono: ['', Validators.required],
      codigoRol: [2]
    });
  }

  registrarEmpresario() {
    if (this.empresarioForm.valid) {
      const datosUsuario = {
        nombre: this.empresarioForm.value.nombre,
        apellido: this.empresarioForm.value.apellido,
        nombreUsuario: this.empresarioForm.value.nombreUsuario,
        email: this.empresarioForm.value.email,
        clave: this.empresarioForm.value.clave,
        codRol: this.empresarioForm.value.codigoRol
      };
  
      const datosEmpresario = {
        razonSocial: this.empresarioForm.value.razonSocial,
        descripcion: this.empresarioForm.value.descripcion,
        telefono: this.empresarioForm.value.telefono
      };
  
      const datosParaEnviar = {
        usuario: datosUsuario,
        empresario: datosEmpresario
      };

      this.empresarioService.registrarUsuario(datosUsuario).subscribe(
        response => {
          // El usuario se registró con éxito, ahora obtén el ID del usuario
          const idUsuario = response.idUsuario;
      
          // Llamas a la función para registrar el empresario con el ID del usuario
          this.empresarioService.registrarEmpresarioUsuario(idUsuario, datosEmpresario).subscribe(
            responseEmpresario => {
              console.log('Empresario registrado exitosamente', response);
              Swal.fire({
                title: "Empresario registrado con éxito!",
                icon: "success",
                confirmButtonText: "OK"
              }).then((result) => {
                if (result.isConfirmed) {
                  // Redirigir al usuario al login
                  window.location.href = "/inicioSesion";
                }
              });
              // Maneja el éxito según tus necesidades
            },
            errorEmpresario => {
              console.error('Error al registrar empresario', errorEmpresario);
      
              // Maneja el error según tus necesidades
            }
          );
        },
        errorUsuario => {
          console.error('Error al registrar usuario', errorUsuario);
      
          // Maneja el error según tus necesidades
        }
      );
    }
  }



}