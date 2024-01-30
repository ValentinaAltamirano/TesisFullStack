import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosComponent } from './comercios.component';

describe('ComerciosComponent', () => {
  let component: ComerciosComponent;
  let fixture: ComponentFixture<ComerciosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComerciosComponent]
    });
    fixture = TestBed.createComponent(ComerciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
