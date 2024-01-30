import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGastronomiaComponent } from './registro-gastronomia.component';

describe('RegistroGastronomiaComponent', () => {
  let component: RegistroGastronomiaComponent;
  let fixture: ComponentFixture<RegistroGastronomiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroGastronomiaComponent]
    });
    fixture = TestBed.createComponent(RegistroGastronomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
