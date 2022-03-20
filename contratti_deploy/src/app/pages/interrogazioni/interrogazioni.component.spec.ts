import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterrogazioniComponent } from './interrogazioni.component';

describe('InterrogazioniComponent', () => {
  let component: InterrogazioniComponent;
  let fixture: ComponentFixture<InterrogazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterrogazioniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterrogazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
