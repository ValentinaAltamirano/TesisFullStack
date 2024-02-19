import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGastronomiaComponent } from './detalle-gastronomia.component';

describe('DetalleGastronomiaComponent', () => {
  let component: DetalleGastronomiaComponent;
  let fixture: ComponentFixture<DetalleGastronomiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleGastronomiaComponent]
    });
    fixture = TestBed.createComponent(DetalleGastronomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
