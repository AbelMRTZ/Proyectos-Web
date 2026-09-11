import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaFichajesPage } from './consultar-fichajes.page';

describe('COnsultarFichajesPage', () => {
  let component: ConsultaFichajesPage;
  let fixture: ComponentFixture<ConsultaFichajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaFichajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
