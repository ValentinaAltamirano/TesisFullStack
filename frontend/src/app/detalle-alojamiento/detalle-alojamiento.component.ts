import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../service/alojamiento.service';


@Component({
  selector: 'app-detalle-alojamiento',
  templateUrl: './detalle-alojamiento.component.html',
  styleUrls: ['./detalle-alojamiento.component.css']
})
export class DetalleAlojamientoComponent {

  establecimientoId: number;
  alojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  imagenPrincipal: string = '';
  numeroColumnas: number = 0;

  constructor(private route: ActivatedRoute, private alojamientoService: AlojamientoService) { 
    this.establecimientoId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.establecimientoId = params['id'];

      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.cargarDatos()
      this.cargarImagenes();
    });

    
  }

  cargarDatos() {
    this.alojamientoService.obtenerAlojamiento(this.establecimientoId).subscribe(
      (detalles) => {
        this.alojamiento = detalles;
        console.log(this.alojamiento);
        },
      (error) => {
        console.error('Error al obtener detalles del alojamiento', error);
      }
    );
  }

  cargarImagenes() {
    this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesAlojamiento = data;
        // Establecer la imagen principal inicialmente como la primera imagen
        this.imagenPrincipal = this.imagenesAlojamiento.length > 0 ? this.imagenesAlojamiento[0].imagen : '';
        this.numeroColumnas = Math.ceil(this.imagenesAlojamiento.length / 2); // Calcula la mitad de la cantidad de imágenes
        
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
}
