import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComercioComponent } from './editar-comercio.component';

describe('EditarComercioComponent', () => {
  let component: EditarComercioComponent;
  let fixture: ComponentFixture<EditarComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarComercioComponent]
    });
    fixture = TestBed.createComponent(EditarComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
