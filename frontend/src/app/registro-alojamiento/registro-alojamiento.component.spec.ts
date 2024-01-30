import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAlojamientoComponent } from './registro-alojamiento.component';

describe('RegistroAlojamientoComponent', () => {
  let component: RegistroAlojamientoComponent;
  let fixture: ComponentFixture<RegistroAlojamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroAlojamientoComponent]
    });
    fixture = TestBed.createComponent(RegistroAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
