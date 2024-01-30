import { Component, OnInit,ElementRef  } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const mapElement: HTMLElement | null = this.elementRef.nativeElement.querySelector('#google-map');
    
    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: -31.4241, lng: -64.4995 },
        zoom: 15
      });

      new google.maps.Marker({
        position: { lat: -31.4241, lng: -64.4995 },
        map: map,
        title: 'Villa Carlos Paz'
      });
    }
  }
}