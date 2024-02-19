import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../service/alojamiento.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detalle-gastronomia',
  templateUrl: './detalle-gastronomia.component.html',
  styleUrls: ['./detalle-gastronomia.component.css']
})
export class DetalleGastronomiaComponent {
  establecimientoId: number;

  locales: any[] = [
    { 
    altura: '1093', 
    calle: 'Boulevard Sarmiento',
    ciudad: 'Villa Carlos Paz',
    provincia: 'Córdoba',
    nombre: 'Ambrogio Restaurante',
    tipoGastronomia: 'Restaurante',
    telefono: '+54 3541 42-1200',
    imagen: '../../assets/ambrogioRestaurante.jpg',
    web: 'https://www.facebook.com/ambrogio.restaurante',
    codEstablecimiento: 1,
    },
    { 
    altura: '675', 
    calle: 'Avenida Illia',
    ciudad: 'Villa Carlos Paz',
    provincia: 'Córdoba',
    nombre: 'Pueblo Mio',
    tipoGastronomia: 'Restaurante',
    telefono: '+54 3541 42-0476',
    imagen: '../../assets/puebloMio.jpg',
    web: 'https://www.facebook.com/PuebloMioR',
    codEstablecimiento: 2,
     }
  ];

  localGastronomico: any;

  constructor(private route: ActivatedRoute, private alojamientoService: AlojamientoService, private http: HttpClient) { 
    this.establecimientoId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      
      this.establecimientoId = params['id'];
      
      this.getEstablecimientoPorId(this.establecimientoId)
      
    });
  }

  getEstablecimientoPorId(id: number) {
    const establecimiento = this.locales.find(local => local.codEstablecimiento == id);
  
    if (establecimiento) {
      // Aquí puedes hacer lo que necesites con el establecimiento
      console.log('Establecimiento encontrado:', establecimiento);
    } else {
      console.log('No se encontró el establecimiento con ID:', id);
    }
  }


}
