import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAlojamientoComponent } from './detalle-alojamiento.component';

describe('DetalleAlojamientoComponent', () => {
  let component: DetalleAlojamientoComponent;
  let fixture: ComponentFixture<DetalleAlojamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAlojamientoComponent]
    });
    fixture = TestBed.createComponent(DetalleAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
