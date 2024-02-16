import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEstablecimientosComponent } from './mis-establecimientos.component';

describe('MisEstablecimientosComponent', () => {
  let component: MisEstablecimientosComponent;
  let fixture: ComponentFixture<MisEstablecimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisEstablecimientosComponent]
    });
    fixture = TestBed.createComponent(MisEstablecimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
