import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GastronomiaService } from '../service/gastronomia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-gastronomia',
  templateUrl: './detalle-gastronomia.component.html',
  styleUrls: ['./detalle-gastronomia.component.css']
})
export class DetalleGastronomiaComponent {
  gastronomiaId: number;
  establecimientoId: number; 
  gastronomia: any;
  imagenesGastronomia: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  imagenPrincipal: string = '';
  numeroColumnas: number = 0;
  comentarios:any;
  stars = [1, 2, 3, 4, 5];
  selectedStars = 0;
  message: string = '';
  remainingCharacters: number = 100;
  reviewForm: FormGroup;
  group: any;
  turistaId: any;
  isAuthenticated: boolean = false;
  editarComentarioForm: FormGroup;


  constructor(private route: ActivatedRoute, private gastronomiaService: GastronomiaService, private http: HttpClient,
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router) { 
    this.gastronomiaId = 0;
    this.establecimientoId = 0;
    this.reviewForm = this.fb.group({});
    this.editarComentarioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(20)]],
      calificacion: [0, Validators.required],
      comentario: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.gastronomiaId = params['id'];
      this.establecimientoId = params['id'];
      
      // Llamar al servicio para obtener detalles según el ID del establecimiento
      await this.cargarDatos();
      
      if (this.authService.isAuthenticated()) {
        this.isAuthenticated = true;
  
        if (await this.authService.canActivateTurista()) {
          // El usuario es turista, realizar acciones adicionales si es necesario
          await this.obtenerDatosTurista();
          console.log(this.turistaId )
        }
      } else {
        this.isAuthenticated = false;
      }
    });

    
  }

  async comentarioForm(turistaId: any) {
    this.reviewForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(20)]],
      calificacion: [0, Validators.required],
      comentario: ['', [Validators.required, Validators.maxLength(300)]],
      establecimiento: [this.establecimientoId],
      turista: [turistaId],
    });
  }

  cargarDatos() {
    this.gastronomiaService.obtenerGastronomia(this.gastronomiaId).subscribe(
      (detalles) => {
        this.gastronomia = detalles;
        console.log(this.gastronomia)
        this.establecimientoId = this.gastronomia.codEstablecimiento
        
        this.cargarImagenes(this.establecimientoId);
        this.getLocationCoordinates(`${this.gastronomia.calle } ${this.gastronomia.altura }, Villa Carlos Paz, Córdoba, Argentina`);  
      },
      (error) => {
        console.error('Error al obtener detalles del alojamiento', error);
      }
    );

    this.authService.obtenerComentariosPorIdEstablecimiento(this.establecimientoId).subscribe(
      (detalles) => {
        this.comentarios = detalles;
      },
      (error) => {
        console.error('Error al obtener detalles del comentario', error);
      }
    );

    
  }

  cargarImagenes(establecimientoId: number) {
    console.log(this.establecimientoId)
    this.gastronomiaService.obtenerImagenesGastronomia(establecimientoId).subscribe(
      (data) => {
        this.imagenesGastronomia = data;
        // Establecer la imagen principal inicialmente como la primera imagen
        this.imagenPrincipal = this.imagenesGastronomia.length > 0 ? this.imagenesGastronomia[0].imagen : '';
        this.numeroColumnas = Math.ceil(this.imagenesGastronomia.length / 2); // Calcula la mitad de la cantidad de imágenes
        
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }
  
  seleccionarImagenPrincipal(imagen: any) {
    // Cambiar la imagen principal al hacer clic en una miniatura
    this.imagenPrincipal = imagen.imagen;
    console.log('URL de la imagen principal:', this.baseUrl + this.imagenPrincipal);
  }

  async obtenerDatosTurista(): Promise<void> {
    try {
      const userInfo: any = await this.authService.obtenerDatosTurista().toPromise();
      this.group = userInfo.groups;
      this.turistaId = userInfo.codTurista;
      this.comentarioForm(this.turistaId);
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
    }
  }

  esTurista(): boolean {
    return this.group == 'Turista';
  }
  
  getLocationCoordinates(address: string) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        this.initMap(location.lat(), location.lng(), results[0].formatted_address);
      } else {
        console.error('Error getting coordinates:', status);
      }
    });
  }

  initMap(latitude: number, longitude: number, locationName: string) {
    const mapElement = document.getElementById('map');

    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong> ${this.gastronomia.nombre} </strong> 
        <br> ${this.gastronomia.calle }  ${this.gastronomia.altura } 
        <br> Villa Carlos Paz, Córdoba`
      });

      infoWindow.open(map, marker);
    } else {
      console.error("Element with ID 'map' not found.");
    }
  }


  submitReview(): void {

    if (this.reviewForm.valid) {
      this.authService.registrarComentario(this.reviewForm.value).subscribe(
        (response: any) => {
          Swal.fire({
            title: "Registro de comentario exitoso",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            location.reload();
          });
        },
        (error) => {
          // Manejar el error, mostrar mensajes de error apropiados al usuario
          console.error(error);
        }
      );
    }
  }

  editarComentario(comentario: any): void {
    // Verificar si el turista actual es el dueño del comentario
    if (this.turistaId && comentario.turista === this.turistaId) {
      // Marcar el comentario como "editando"
      comentario.editando = true;

      // Llenar el formulario de edición con los datos actuales del comentario
      this.editarComentarioForm.setValue({
        titulo: comentario.titulo,
        calificacion: comentario.calificacion,
        comentario: comentario.comentario,
      });
    } else {
      console.log('No tienes permisos para editar este comentario.');
      // Puedes mostrar un mensaje al usuario o realizar otra acción en caso de no tener permisos
    }
  }

  guardarEdicion(comentario: any): void {
    // Aquí puedes enviar la solicitud de actualización al backend
    const comentarioEditado = { ...comentario, ...this.editarComentarioForm.value };
    console.log(comentarioEditado)
    this.authService.editarComentario(comentarioEditado, comentario.codComentario).subscribe(
      (response: any) => {
        Swal.fire({
            title: "Comentario actualizado exitosamente",
            icon: "success",
            timer: 1000,  // Duración en milisegundos (3 segundos en este ejemplo)
            timerProgressBar: true
          }).then((result) => {
            if (result) {
              location.reload();
            }
          });;

        // Marcar el comentario como "no editando"
        comentario.editando = false;
      },
      (error) => {
        console.error('Error al editar el comentario:', error);
        // Puedes mostrar un mensaje de error al usuario o realizar otras acciones
      }
    );
  }

  eliminarComentario(comentario: any): void {
    // Verificar si el turista actual es el dueño del comentario
    if (this.turistaId && comentario.turista === this.turistaId) {
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar el comentario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para eliminar el comentario
          this.authService.eliminarComentario(comentario.codComentario).subscribe(
            () => {
              console.log('Comentario eliminado con éxito.');
              // Puedes realizar alguna lógica adicional después de la eliminación si es necesario.
  
              // Mostrar mensaje de éxito después de la eliminación
              Swal.fire({
                title: 'Comentario eliminado',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                // Actualizar la página después de mostrar el mensaje de éxito
                location.reload();
              });
            },
            (error: any) => {
              console.error('Error al intentar eliminar el comentario:', error);
            }
          );
        } else {
          // El usuario hizo clic en "Cancelar", no hacer nada
          console.log('Cancelado por el usuario');
        }
      });
    }
  }
}
