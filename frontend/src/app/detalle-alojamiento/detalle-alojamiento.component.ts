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
  detallesAlojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';

  constructor(private route: ActivatedRoute, private alojamientoService: AlojamientoService) { 
    this.establecimientoId = 0;

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.establecimientoId = params['id'];
      console.log(this.establecimientoId);

      // Llamar al servicio para obtener detalles según el ID del establecimiento
      this.alojamientoService.obtenerAlojamiento(this.establecimientoId).subscribe(
        (detalles) => {
          this.detallesAlojamiento = detalles;
          console.log(this.detallesAlojamiento)

          this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
              (imagenes) => {
                this.imagenesAlojamiento = imagenes;
                console.log(this.imagenesAlojamiento)
                
              },
              (error) => {
                console.error('Error al obtener imágenes del alojamiento', error);
              }
            );
          },
        (error) => {
          console.error('Error al obtener detalles del alojamiento', error);
        }
      );
    });
  }
  
}
