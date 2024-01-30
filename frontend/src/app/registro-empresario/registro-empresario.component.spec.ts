import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpresarioComponent } from './registro-empresario.component';

describe('RegistroEmpresarioComponent', () => {
  let component: RegistroEmpresarioComponent;
  let fixture: ComponentFixture<RegistroEmpresarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEmpresarioComponent]
    });
    fixture = TestBed.createComponent(RegistroEmpresarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
