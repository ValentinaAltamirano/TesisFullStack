import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlojamientoComponent } from './editar-alojamiento.component';

describe('EditarAlojamientoComponent', () => {
  let component: EditarAlojamientoComponent;
  let fixture: ComponentFixture<EditarAlojamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAlojamientoComponent]
    });
    fixture = TestBed.createComponent(EditarAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
