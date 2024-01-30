import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlojamientoComponent } from './alojamiento.component';

describe('AlojamientoComponent', () => {
  let component: AlojamientoComponent;
  let fixture: ComponentFixture<AlojamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlojamientoComponent]
    });
    fixture = TestBed.createComponent(AlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
