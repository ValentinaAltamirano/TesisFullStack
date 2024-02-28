import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleComercioComponent } from './detalle-comercio.component';

describe('DetalleComercioComponent', () => {
  let component: DetalleComercioComponent;
  let fixture: ComponentFixture<DetalleComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleComercioComponent]
    });
    fixture = TestBed.createComponent(DetalleComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
