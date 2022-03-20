import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegnalazioniComponent } from './segnalazioni.component';

describe('SegnalazioniComponent', () => {
  let component: SegnalazioniComponent;
  let fixture: ComponentFixture<SegnalazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegnalazioniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegnalazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
