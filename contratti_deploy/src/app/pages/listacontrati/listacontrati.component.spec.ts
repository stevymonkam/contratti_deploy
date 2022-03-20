import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacontratiComponent } from './listacontrati.component';

describe('ListacontratiComponent', () => {
  let component: ListacontratiComponent;
  let fixture: ComponentFixture<ListacontratiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListacontratiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListacontratiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
