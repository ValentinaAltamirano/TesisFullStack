import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  {
  perfilForm!: FormGroup;
  apellido = new FormControl('');
  nombre = new FormControl('');
  email = new FormControl('', [Validators.email]);
  telefono = new FormControl('');
  username = new FormControl('');
  razonSocial = new FormControl('');
  cambiarContrasenaForm: FormGroup;
  mostrarFormularioContrasena = false;
  showPassword = false;
  showConfirmPassword = false;
  showConfirmPasswordIcon: boolean = false;
  showNewPassword: boolean = false;
  showCurrentPassword: boolean = false;
  errorMessage: any;


  editando = false;
  datosOriginales: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6), this.validatePassword, Validators.maxLength(50)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(6), this.validatePassword, Validators.maxLength(50)]],
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
    const password = group.get('nuevaContrasena')?.value;
    const confirm_password = group.get('confirmarContrasena')?.value;
  
    if (password !== confirm_password) {
      return { 'passwordMismatch': true };
    }
  
    return null;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'contrasenaActual') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'nuevaContrasena') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm_password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  ngOnInit() {
    // Inicializar FormGroup y asignar FormControls
    this.perfilForm = this.fb.group({
      nombre:  ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, this.validarTelefono]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(50)]],
      razonSocial: ['', [Validators.required, Validators.maxLength(50)]],
    });

    // Obtener y asignar los datos del usuario
    this.obtenerDatosUsuario();
  }

  validarTelefono(control: AbstractControl): Promise<{ [key: string]: any } | null> {
    return new Promise((resolve, reject) => {
      const telefonoRegex = /^[0-9]{10,}$/; // Formato: 10 o más dígitos numéricos
      const esValido = telefonoRegex.test(control.value);
  
      if (!control.value) {
        resolve({ 'telefonoVacio': true });
      } else {
        resolve(esValido ? null : { 'telefonoInvalido': true });
      }
    });
  }

  obtenerDatosUsuario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.perfilForm.patchValue(userInfo);

        // Almacenar los datos originales para restaurar en caso de cancelación
        this.datosOriginales = { ...userInfo };
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  guardarCambios() {
    const nuevosDatos = this.perfilForm.value;

    this.authService.actualizarDatosEmpresario(nuevosDatos).subscribe(
      response => {
        Swal.fire({
          title: "Datos actualizados exitosamente",
          icon: "success",
          timer: 1000,  // Duración en milisegundos (3 segundos en este ejemplo)
          timerProgressBar: true
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            // Si el usuario no interactuó y el temporizador se agotó
            location.reload();
          }
        });
        console.log('Datos actualizados exitosamente', response);
        this.editando = false;

        // Actualizar datos originales con los nuevos valores
        this.datosOriginales = { ...nuevosDatos };
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
        // Ejemplo de cómo manejar un error específico
        if (error.error && error.error.error === 'El nombre de usuario ya está en uso') {
          this.perfilForm.get('username')?.setErrors({ duplicateUsername: true });
        } else if (error.error && error.error.error === 'El correo electrónico ya está en uso') {
          this.perfilForm.get('email')?.setErrors({ duplicateEmail: true });
        }
      }
    );
  }


  cancelarEdicion() {
    this.editando = false;
    // Restaurar los datos editados a los originales
    this.perfilForm.patchValue(this.datosOriginales);
  }

  volverAlInicio() {
    this.router.navigate(['/']).then(() => {
      location.reload();
    }); 
  }

  mostrarFormulario() {
    this.mostrarFormularioContrasena = true;
  }

  cancelarCambioContrasena() {
    this.mostrarFormularioContrasena = false;
    // Puedes reiniciar los valores del formulario si es necesario
    this.cambiarContrasenaForm.reset();
  }

  guardarCambioContrasena() {
    const formValues = this.cambiarContrasenaForm.value;
    if (this.cambiarContrasenaForm.valid) {

    this.authService.cambiarContrasenaEmpresario(formValues)
      .subscribe(
        (response: any) => {
          Swal.fire({
            title: "Cambio de contraseña exitoso!",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            location.reload();
          });
        },
        error => {
          console.error('Error al cambiar la contraseña', error);
          if (error.error && error.error.error === 'La contraseña actual es incorrecta') {
            this.cambiarContrasenaForm.get('contrasenaActual')?.setErrors({ incorrectCurrentPassword: true });
            // Puedes agregar un mensaje adicional si lo deseas
            this.errorMessage = 'La contraseña actual es incorrecta. Por favor, inténtalo de nuevo.';
          } else {
            // Otros errores
            this.errorMessage = 'Se produjo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.';
          }
        }
      );

    }
  }
}