import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service'; 
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-registro-empresario',
  templateUrl: './registro-empresario.component.html',
  styleUrls: ['./registro-empresario.component.css']
})

export class RegistroEmpresarioComponent {

  empresarioForm: FormGroup = new FormGroup({});
  usuarioId: number = 0;
  mensajeError: string = '';
  showPassword = false;
  showConfirmPassword = false;
  showConfirmPasswordIcon: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.empresarioForm = this.fb.group({
      // Campos del usuario
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.validatePassword]],
      confirm_password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre:  ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],

      // Campos del Empresario
      razonSocial: ['', Validators.required],
      descripcion: ['', Validators.required],
      telefono: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  validatePassword(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    if (!hasNumber || !hasLetter) {
      return { 'passwordRequirements': true };
    }
  
    return null;
  }
  
  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm_password = group.get('confirm_password')?.value;
  
    if (password !== confirm_password) {
      return { 'passwordMismatch': true };
    }
  
    return null;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm_password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
  submitForm() {
    // Validar formulario
    if (this.empresarioForm.valid) {
      // Enviar datos al servicio de autenticación
      this.authService.registrarEmpresario(this.empresarioForm.value).subscribe(
        (response: any) => {
          Swal.fire({
            title: "Inicio de sesión exitoso",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            this.router.navigate(['/inicioSesion']);
          });
        },
        (error) => {
          // Manejar el error, mostrar mensajes de error apropiados al usuario
          console.error(error);
          // Ejemplo de cómo manejar un error específico
          if (error.error && error.error.error === 'El nombre de usuario ya está en uso') {
            this.empresarioForm.get('username')?.setErrors({ duplicateUsername: true });
          } else if (error.error && error.error.error === 'El correo electrónico ya está en uso') {
            this.empresarioForm.get('email')?.setErrors({ duplicateEmail: true });
          }
        }
      );
    }
  }


  ngOnInit(): void {}

  
}