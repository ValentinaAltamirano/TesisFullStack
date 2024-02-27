import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGastronomiaComponent } from './editar-gastronomia.component';

describe('EditarGastronomiaComponent', () => {
  let component: EditarGastronomiaComponent;
  let fixture: ComponentFixture<EditarGastronomiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarGastronomiaComponent]
    });
    fixture = TestBed.createComponent(EditarGastronomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
