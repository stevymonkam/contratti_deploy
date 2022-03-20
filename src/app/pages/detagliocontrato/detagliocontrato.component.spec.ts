import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetagliocontratoComponent } from './detagliocontrato.component';

describe('DetagliocontratoComponent', () => {
  let component: DetagliocontratoComponent;
  let fixture: ComponentFixture<DetagliocontratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetagliocontratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetagliocontratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
